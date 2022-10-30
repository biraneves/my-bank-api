import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

// Create an account based on request body
const createAccount = async (req, res, next) => {
    try {
        let account = req.body;

        if (!account.name || account.balance == null)
            throw new Error('Name and balance are required fields.');

        const data = JSON.parse(await readFile(global.accountsFileName));

        account = {
            id: data.nextId++,
            name: account.name,
            balance: account.balance,
        };

        data.accounts.push(account);

        await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));

        global.logger.info(`POST /account - ${JSON.stringify(account)}`);
        res.send(account);
    } catch (err) {
        next(err);
    }
};

// Read all accounts
const readAccounts = async (_req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.accountsFileName));
        delete data.nextId;

        global.logger.info(`GET /account`);
        res.send(data);
    } catch (err) {
        next(err);
    }
};

export default {
    createAccount,
    readAccounts,
};
