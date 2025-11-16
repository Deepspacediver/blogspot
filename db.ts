import { Pool } from "pg";

const psqlPool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

export default psqlPool;
