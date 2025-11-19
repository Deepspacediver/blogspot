import psqlPool from "../../../db";
import { UserCK } from "../types";

export const findUserByEmail = async (email: string) => {
  try {
    //todo remove password fetching ?
    const user = await psqlPool.query<UserCK>(
      `
      SELECT * FROM users WHERE email = $1;
    `,
      [email],
    );

    return user?.rows?.[0];
  } catch (e) {
    // todo
    console.error(e);
  }
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
  console.log({ user: user.rows });
  return user?.rows?.[0];
};
