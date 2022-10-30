import AccountService from '../services/account.service.js';

// Create an account based on request body
const createAccount = async (req, res, next) => {
    try {
        let account = req.body;

        if (!account.name || account.balance == null)
            throw new Error('Name and balance are required fields.');

        account = await AccountService.createAccount(account);

        global.logger.info(`POST /account - ${JSON.stringify(account)}`);
        res.send(account);
    } catch (err) {
        next(err);
    }
};

// Read all accounts
const readAccounts = async (_req, res, next) => {
    try {
        const data = await AccountService.readAccounts();

        global.logger.info(`GET /account`);
        res.send(data);
    } catch (err) {
        next(err);
    }
};

// Search an account by Id
const searchAccountById = async (req, res, next) => {
    try {
        const account = await AccountService.searchAccountById(
            parseInt(req.params.id),
        );

        global.logger.info(`GET /account/:id`);
        res.send(account);
    } catch (err) {
        next(err);
    }
};

// Delete an account by Id
const deleteAccount = async (req, res, next) => {
    try {
        await AccountService.deleteAccount(parseInt(req.params.id));

        global.logger.info(`DELETE /account/:id - ${req.params.id}`);
        res.end();
    } catch (err) {
        next(err);
    }
};

// Update an account entirely
const updateAccount = async (req, res, next) => {
    try {
        const account = req.body;

        if (!account.id || !account.name || account.balance == null)
            throw new Error('Id, name and balance are required fields.');

        const data = await AccountService.updateAccount(account);

        global.logger.info(`PUT /account - ${JSON.stringify(data)}`);
        res.send(data);
    } catch (err) {
        next(err);
    }
};

const updateAccountBalance = async (req, res, next) => {
    try {
        const account = req.body;

        if (!account.id || account.balance == null)
            throw new Error('Id and balance are required fields.');

        const data = await AccountService.updateAccountBalance(account);

        global.logger.info(`PATCH /updateBalance - ${JSON.stringify(account)}`);
        res.send(data);
    } catch (err) {
        next(err);
    }
};

export default {
    createAccount,
    readAccounts,
    searchAccountById,
    deleteAccount,
    updateAccount,
    updateAccountBalance,
};
