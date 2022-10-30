import AccountRepository from '../repositories/account.repository.js';

const createAccount = async (account) => {
    return await AccountRepository.createAccount(account);
};

const readAccounts = async () => {
    return await AccountRepository.readAccounts();
};

const searchAccountById = async (id) => {
    return await AccountRepository.readAccount(id);
};

const deleteAccount = async (id) => {
    await AccountRepository.deleteAccount(id);
};

const updateAccount = async (account) => {
    return await AccountRepository.updateAccount(account);
};

const updateAccountBalance = async (account) => {
    const acc = await AccountRepository.readAccount(account.id);
    acc.balance = account.balance;

    return await AccountRepository.updateAccount(acc);
};

export default {
    createAccount,
    readAccounts,
    searchAccountById,
    deleteAccount,
    updateAccount,
    updateAccountBalance,
};
