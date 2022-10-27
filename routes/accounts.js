import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();
const { readFile, writeFile } = fs;

router.post('/', async (req, res, next) => {
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
});

router.get('/', async (_req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.accountsFileName));
        delete data.nextId;

        global.logger.info(`GET /account`);
        res.send(data);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.accountsFileName));
        const account = data.accounts.find(
            (account) => account.id === parseInt(req.params.id),
        );

        global.logger.info(`GET /account/:id`);
        res.send(account);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.accountsFileName));
        data.accounts = data.accounts.filter(
            (account) => account.id !== parseInt(req.params.id),
        );

        await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));

        global.logger.info(`DELETE /account/:id - ${req.params.id}`);
        res.end();
    } catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const account = req.body;

        if (!account.id || !account.name || account.balance == null)
            throw new Error('Id, name and balance are required fields.');

        const data = JSON.parse(await readFile(global.accountsFileName));

        const index = data.accounts.findIndex((a) => a.id === account.id);

        if (index === -1) throw new Error('Account not found.');

        data.accounts[index].name = account.name;
        data.accounts[index].balance = account.balance;

        await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));

        global.logger.info(
            `PUT /account - ${JSON.stringify(data.accounts[index])}`,
        );
        res.send(data.accounts[index]);
    } catch (err) {
        next(err);
    }
});

router.patch('/updateBalance', async (req, res, next) => {
    try {
        const account = req.body;
        const data = JSON.parse(await readFile(global.accountsFileName));

        const index = data.accounts.findIndex((a) => a.id === account.id);

        if (!account.id || account.balance == null)
            throw new Error('Id and balance are required fields.');

        if (index === -1) throw new Error('Account not found.');

        data.accounts[index].balance = account.balance;

        await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));

        global.logger.info(`PATCH /updateBalance - ${JSON.stringify(account)}`);
        res.send(data.accounts[index]);
    } catch (err) {
        next(err);
    }
});

router.use((err, req, res, _next) => {
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({ error: err.message });
});

export default router;
