import express from 'express';
import { promises as fs } from 'fs';

import accountsRouter from './routes/accounts.js';

global.accountsFileName = 'accounts.json';

const PORT = 3000;

const { readFile, writeFile } = fs;

const app = express();
app.use(express.json());

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
            .then(() => console.log('Accounts file created.'))
            .catch((err) => console.log(err));
    }

    console.log(`myBank API started at port ${PORT}`);
});
