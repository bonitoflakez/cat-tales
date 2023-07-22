const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    const databaseConfig = {
      user: "postgres",
      password: "user@postgres",
      host: "localhost",
      port: 5432,
      database: "cat_tale_db",
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
