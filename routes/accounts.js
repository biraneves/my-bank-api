import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();
const { readFile, writeFile } = fs;

router.post('/', async (req, res) => {
    try {
        let account = req.body;
        const data = JSON.parse(await readFile('accounts.json'));

        account = {
            id: data.nextId++,
            ...account,
        };

        data.accounts.push(account);

        await writeFile('accounts.json', JSON.stringify(data, null, 4));

        res.send(account);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

export default router;
