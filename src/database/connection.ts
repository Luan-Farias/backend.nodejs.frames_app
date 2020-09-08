import knex from 'knex';
import path from 'path';

const dbConfig = {
    client: process.env.DB_DRIVER,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.NODE_ENV === 'test'
            ? process.env.DB_TEST_NAME
            : process.env.DB_NAME,
    },
    migrations: {
        directory: path.resolve(__dirname, 'migrations'),
    },
};

const db = knex(dbConfig);

export default db;
