import { Pool } from "pg";

const USER = "postgres";
const PASSWD = "user@postgres";
const HOST = "localhost";
const PORT = 5432;
const DB = "cat_tale_db";

const pool = new Pool({
  user: USER,
  password: PASSWD,
  host: HOST,
  port: PORT,
  database: DB,
});

export default pool;
