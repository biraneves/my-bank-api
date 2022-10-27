export const swaggerDoc = {
    swagger: '2.0',
    info: {
        description: 'My Bank API description',
        version: '0.1.0',
        title: 'My Bank API',
        contact: {
            email: 'ubirajara.neves@usp.br',
        },
        license: {
            name: 'Apache 2.0',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    host: 'localhost:3000',
    tags: [
        {
            name: 'account',
            description: 'Account management',
        },
    ],
    schemes: ['http'],
    paths: {
        '/account': {
            post: {
                tags: ['account'],
                summary: 'Create a new account',
                description:
                    'Create a new account with the received parameters',
                operationId: 'addPet',
                consumes: ['application/json'],
                produces: ['application/json'],
                parameters: [
                    {
                        in: 'body',
                        name: 'body',
                        description: 'Account object',
                        required: true,
                        schema: {
                            $ref: '#/definitions/Account',
                        },
                    },
                ],
                responses: {
                    405: {
                        description: 'Invalid input',
                    },
                },
                security: [
                    {
                        petstore_auth: ['write:pets', 'read:pets'],
                    },
                ],
            },
            get: {
                tags: ['account'],
                summary: 'Get existing accounts',
                description: 'Get existing accounts description',
                produces: ['application/json'],
                responses: {
                    200: {
                        description: 'successful operation',
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/definitions/Account',
                            },
                        },
                    },
                    400: {
                        description: 'Error occurred',
                    },
                },
            },
        },
    },
    definitions: {
        Account: {
            type: 'object',
            required: ['name', 'balance'],
            properties: {
                name: {
                    type: 'string',
                    example: 'John Doe',
                },
                balance: {
                    type: 'integer',
                    format: 'int64',
                    example: '234.56',
                },
            },
        },
    },
};
