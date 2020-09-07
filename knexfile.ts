import path from 'path';
import 'dotenv/config';

module.exports = {
    client: process.env.DB_DRIVER,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    migrations: {
        directory: path.resolve(__dirname, "src", "database", "migrations"),
    },
    useNullAsDefault: true,
};
