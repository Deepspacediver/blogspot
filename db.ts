import { Pool } from "pg";

const psqlPool = new Pool({
  connectionString: process.env.POOL_CONNECTION_STRING,
});

export default psqlPool;