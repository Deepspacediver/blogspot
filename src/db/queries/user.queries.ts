"use server";

import psqlPool from "..";
import { OptionalReturn, UserCK, UserRole } from "../types";

export const findUserByEmail = async (email: string) => {
  const user = await psqlPool.query<OptionalReturn<UserCK>>(
    `
      SELECT * FROM users WHERE email = $1;
    `,
    [email],
  );

  return user?.rows?.[0];
};

export const findUserById = async (id: number) => {
  const user = await psqlPool.query<OptionalReturn<UserCK>>(
    `
      SELECT * FROM users WHERE id = $1;
    `,
    [id],
  );

  return user?.rows?.[0];
};

type CreateUserProps = {
  email: string;
  password: string;
  role?: UserRole;
};

type UserReturn = Pick<UserCK, "id" | "role" | "username" | "email">;

export const createUser = async ({ email, password, role = UserRole.USER }: CreateUserProps) => {
  const user = await psqlPool.query<UserReturn>(
    `INSERT INTO users (
      email, password, role
    ) VALUES ( 
      $1, $2, $3
    ) RETURNING id, role, username, email;`,
    [email, password, role],
  );
  return user?.rows?.[0];
};

type UpdateUserProps = { id: number } & Partial<Omit<UserCK, "createdAt" | "updatedAt" | "id">>;

export const updateUser = async ({ id, ...rest }: UpdateUserProps) => {
  const columnNames = Object.entries(rest)
    .filter(([_, val]) => val !== undefined)
    .map(([key], i) => `${key} = $${i + 1}`)
    .join(", ");
  const whereIndex = columnNames.length;
  const columnValues = [...Object.entries(rest).flatMap(([_, val]) => (!!val ? [val] : [])), id];

  const user = await psqlPool.query<UserReturn>(
    `
    UPDATE users
      SET ${columnNames}
      WHERE id = $${whereIndex}
      RETURNING id, role, username, email;
  `,
    columnValues,
  );

  return user?.rows?.[0];
};
