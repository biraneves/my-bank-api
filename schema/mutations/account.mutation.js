import { GraphQLBoolean, GraphQLInt } from 'graphql';

import accountService from '../../services/account.service.js';
import Account from '../types/Account.js';
import AccountInput from '../types/AccountInput.js';

const accountMutation = {
    createAccount: {
        type: Account,
        args: {
            account: {
                name: 'account',
                type: AccountInput,
            },
        },
        resolve: (_, args) => accountService.createAccount(args.account),
    },
    deleteAccount: {
        type: GraphQLBoolean,
        args: {
            id: {
                name: 'id',
                type: GraphQLInt,
            },
        },
        resolve: (_, args) => accountService.deleteAccount(args.id),
    },
    updateAccount: {
        type: Account,
        args: {
            account: {
                name: 'account',
                type: AccountInput,
            },
        },
        resolve: (_, args) => accountService.updateAccount(args.account),
    },
};

export default accountMutation;
