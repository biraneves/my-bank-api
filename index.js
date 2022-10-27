import express from 'express';
import winston from 'winston';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { promises as fs } from 'fs';

import accountsRouter from './routes/accounts.js';
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

app.use('/account', accountsRouter);

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
