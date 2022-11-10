import express from 'express';
import winston from 'winston';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';
import { promises as fs } from 'fs';
// import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';

import accountsRouter from './routes/account.routes.js';
import { swaggerDoc } from './doc.js';
import AccountService from './services/account.service.js';
import Schema from './schema/index.js';

global.accountsFileName = 'accounts.json';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(
    ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`,
);
global.logger = winston.createLogger({
    level: 'silly',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'my-bank-api.log' }),
    ],
    format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormat),
});

const PORT = 3000;

const { readFile, writeFile } = fs;

// GraphQL Schema
// const schema = buildSchema(`
//     type Account {
//         id: Int
//         name: String
//         balance: Float
//     }
//     input AccountInput {
//         id: Int
//         name: String
//         balance: Float
//     }
//     type Query {
//         getAccounts: [Account]
//         getAccount(id: Int): Account
//     }
//     type Mutation {
//         createAccount(account: AccountInput): Account
//         deleteAccount(id: Int): Boolean
//         updateAccount(account: AccountInput): Account
//     }
// `);
// End Schema

const app = express();
app.use(express.json());
app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const getRole = (username) => {
    if (username == 'admin') return 'admin';
    else if (username == 'biraneves') return 'role1';
};

const authorize = (...allowed) => {
    const isAllowed = (role) => allowed.indexOf(role) > -1;

    return (req, res, next) => {
        if (req.auth.user) {
            const role = getRole(req.auth.user);

            if (isAllowed(role)) {
                next();
            } else {
                res.status(401).send('Role not allowed.');
            }
        } else {
            res.status(403).send('User not found.');
        }
    };
};

app.use(
    basicAuth({
        authorizer: (username, password) => {
            const userMatches = basicAuth.safeCompare(username, 'admin');
            const passwordMatches = basicAuth.safeCompare(password, 'admin');

            const user2Matches = basicAuth.safeCompare(username, 'biraneves');
            const password2Matches = basicAuth.safeCompare(password, '123');

            return (
                (userMatches && passwordMatches) ||
                (user2Matches && password2Matches)
            );
        },
    }),
);
app.use('/account', authorize('admin'), accountsRouter);

// GraphQL endpoint
// const root = {
//     getAccounts: () => AccountService.readAccounts(),
//     getAccount: (args) => AccountService.searchAccountById(args.id),
//     createAccount: ({ account }) => AccountService.createAccount(account),
//     deleteAccount: (args) => AccountService.deleteAccount(args.id),
//     updateAccount: ({ account }) => AccountService.updateAccount(account),
// };

app.use(
    '/graphql',
    graphqlHTTP({
        schema: Schema,
        // rootValue: root,
        graphiql: true,
    }),
);

app.listen(PORT, async () => {
    try {
        await readFile(global.accountsFileName);
    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: [],
        };

        writeFile(global.accountsFileName, JSON.stringify(initialJson))
            .then(() => global.logger.info('Accounts file created.'))
            .catch((err) => global.logger.error(err));
    }

    global.logger.info(`myBank API started at port ${PORT}`);
});
