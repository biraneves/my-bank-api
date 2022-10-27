import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();
const { readFile, writeFile } = fs;

router.post('/', async (req, res, next) => {
    try {
        let account = req.body;
        const data = JSON.parse(await readFile(global.accountsFileName));

        account = {
            id: data.nextId++,
            ...account,
        };

        data.accounts.push(account);

        await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));

        res.send(account);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (_req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.accountsFileName));
        delete data.nextId;

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
        res.end();
    } catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const account = req.body;
        const data = JSON.parse(await readFile(global.accountsFileName));

        const index = data.accounts.findIndex((a) => a.id === account.id);

        data.accounts[index] = account;

        await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));

        res.send(account);
    } catch (err) {
        next(err);
    }
});

router.patch('/updateBalance', async (req, res, next) => {
    try {
        const account = req.body;
        const data = JSON.parse(await readFile(global.accountsFileName));

        const index = data.accounts.findIndex((a) => a.id === account.id);

        data.accounts[index].balance = account.balance;

        await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));

        res.send(data.accounts[index]);
    } catch (err) {
        next(err);
    }
});

router.use((err, _req, res, _next) => {
    console.log(err.message);
    res.status(400).send({ error: err.message });
});

export default router;
