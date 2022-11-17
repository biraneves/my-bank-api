import express from 'express';
import winston from 'winston';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';

import accountsRouter from './routes/account.routes.js';
import { swaggerDoc } from './doc.js';

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

const app = express();
app.use(express.json());
app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const authorize = (...allowed) => {
    const isAllowed = (role) => allowed.indexOf(role) > -1;

    return (req, res, next) => {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !auth.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Access denied' });
        }

        const token = authHeader.substring(7, authHeader.length);

        jwt.verify(token, 'secretKey', (err, payload) => {
            if (err) {
                res.status(401).json({ message: 'Invalid token' });
            }

            if (isAllowed(payload.role)) {
                next();
            } else {
                res.status(401).send('Role not allowed');
            }
        });
    };
};

app.use('/account', authorize('admin'), accountsRouter);

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
