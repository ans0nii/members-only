import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

export default pool;
