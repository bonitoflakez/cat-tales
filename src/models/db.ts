import { Pool } from 'pg';

const user = process.env.USER;
const passwd = process.env.PASSWD;
const host = process.env.HOST;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined; // Convert port to number
const db = process.env.DB;

const pool = new Pool({
  user: user,
  password: passwd,
  host: host,
  port: port,
  database: db
});

export default pool;
