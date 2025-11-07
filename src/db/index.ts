import { Pool } from "pg";

const dbClient = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

export default dbClient;
