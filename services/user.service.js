import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

var users = {};

const getUsers = async () => {
    return users;
};

const createUser = async (user) => {
    const encPassword = await bcrypt.hash(user.password, 10);

    users[user.username] = {
        password: encPassword,
        role: user.role,
    };

    return user;
};

const login = async (user) => {
    const dbUser = users[user.username];

    if (dbUser) {
        const passwordMatches = await bcrypt.compare(
            user.password,
            dbUser.password,
        );

        if (passwordMatches) {
            const token = jwt.sign(
                { role: dbUser.role, course: 'Node' },
                'secretKey',
                { expiresIn: 300 },
            );

            return token;
        }
    } else {
        throw new Error('User not found');
    }
};
