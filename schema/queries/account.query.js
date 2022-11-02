import { GraphQLInt, GraphQLList } from 'graphql';

import Account from '../types/Account.js';
import accountService from '../../services/account.service.js';

const accountQueries = {
    getAccounts: {
        type: new GraphQLList(Account),
        resolve: () => accountService.readAccounts(),
    },
    getAccount: {
        type: Account,
        args: {
            id: {
                name: 'id',
                type: GraphQLInt,
            },
        },
        resolve: (_, args) => accountService.searchAccountById(args.id),
    },
};

export default accountQueries;
