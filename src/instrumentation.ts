import { populateDb } from "./db/populate-db";

export async function register() {
  await populateDb();
}
