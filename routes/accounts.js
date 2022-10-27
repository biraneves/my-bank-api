import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();
const { readFile, writeFile } = fs;

router.post('/', async (req, res) => {
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
        res.status(400).send({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.accountsFileName));
        delete data.nextId;

        res.send(data);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.accountsFileName));
        const account = data.accounts.find(
            (account) => account.id === parseInt(req.params.id),
        );
        res.send(account);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.accountsFileName));
        data.accounts = data.accounts.filter(
            (account) => account.id !== parseInt(req.params.id),
        );

        await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));
        res.end();
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

export default router;
