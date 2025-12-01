"use server";

import psqlPool from "../../../db";
import { UserCK } from "../types";

export const findUserByEmail = async (email: string) => {
  const user = await psqlPool.query<UserCK>(
    `
      SELECT * FROM users WHERE email = $1;
    `,
    [email],
  );

  return user?.rows?.[0];
};

type CreateUserProps = {
  email: string;
  password: string;
};
export const createUser = async ({ email, password }: CreateUserProps) => {
  const user = await psqlPool.query<UserCK>(
    `INSERT INTO users (
      email, password
    ) VALUES ( 
      $1, $2
    ) RETURNING id, role;`,
    [email, password],
  );
  return user?.rows?.[0];
};
