import express from 'express';

import AccountController from '../controllers/account.controller.js';

const router = express.Router();

router.post('/', AccountController.createAccount);
router.get('/', AccountController.readAccounts);
router.get('/:id', AccountController.searchAccountById);
router.delete('/:id', AccountController.deleteAccount);
router.put('/', AccountController.updateAccount);
router.patch('/updateBalance', AccountController.updateAccountBalance);

router.use((err, req, res, _next) => {
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({ error: err.message });
});

export default router;
