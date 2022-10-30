import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const createAccount = async (account) => {
    const data = JSON.parse(await readFile(global.accountsFileName));

    account = {
        id: data.nextId++,
        name: account.name,
        balance: account.balance,
    };

    data.accounts.push(account);

    await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));

    return account;
};

const readAccounts = async () => {
    const data = JSON.parse(await readFile(global.accountsFileName));
    delete data.nextId;

    return data;
};

const searchAccountById = async (id) => {
    const data = JSON.parse(await readFile(global.accountsFileName));
    const account = data.accounts.find((account) => account.id === id);

    return account;
};

const deleteAccount = async (id) => {
    const data = JSON.parse(await readFile(global.accountsFileName));
    data.accounts = data.accounts.filter((account) => account.id !== id);

    await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));
};

const updateAccount = async (account) => {
    const data = JSON.parse(await readFile(global.accountsFileName));

    const index = data.accounts.findIndex((a) => a.id === account.id);

    if (index === -1) throw new Error('Account not found.');

    data.accounts[index].name = account.name;
    data.accounts[index].balance = account.balance;

    await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));

    return data.accounts[index];
};

const updateAccountBalance = async (account) => {
    const data = JSON.parse(await readFile(global.accountsFileName));

    const index = data.accounts.findIndex((a) => a.id === account.id);

    if (index === -1) throw new Error('Account not found.');

    data.accounts[index].balance = account.balance;

    await writeFile(global.accountsFileName, JSON.stringify(data, null, 4));

    return data.accounts[index];
};

export default {
    createAccount,
    readAccounts,
    searchAccountById,
    deleteAccount,
    updateAccount,
    updateAccountBalance,
};
