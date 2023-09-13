const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

async function main() {
  try {
    const databaseConfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    };

    const pool = new Pool(databaseConfig);

    const createTablesScript = fs.readFileSync(
      path.join(__dirname, "001_create_tables.sql"),
      "utf8"
    );
    const insertDataScript = fs.readFileSync(
      path.join(__dirname, "002_insert_sample_data.sql"),
      "utf8"
    );

    await pool.query(createTablesScript);

    await pool.query(insertDataScript);

    console.log("Database migration successful.");
    pool.end();
  } catch (err) {
    console.error("Error initializing the database:", err);
  }
}

main();
