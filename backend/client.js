import pg from 'pg';
const client = new pg.Pool({connectionString: process.env.DATABASE_URL});
export default client;
