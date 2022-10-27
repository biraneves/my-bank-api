import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

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

export default {
    createAccount,
};
