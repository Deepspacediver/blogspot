enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type User = {
  id: string;
  email: string;
  username?: string;
  password: string;
  created_at: Date;
  updated_at?: Date;
  picture?: string;
  role: UserRole;
};

type SnakeToCamelCase<T extends string> = T extends `_${infer U}`
  ? SnakeToCamelCase<Lowercase<U>>
  : T extends `_${infer U}_${infer P}`
    ? `${Lowercase<U>}${Capitalize<SnakeToCamelCase<P>>}`
    : T extends `${infer U}_${infer P}`
      ? `${U}${SnakeToCamelCase<Capitalize<P>>}`
      : T;

export type DeepCamelCaseKeys<T extends Record<string, unknown>> = {
  [U in keyof T as SnakeToCamelCase<U extends string & keyof T ? U : never>]: T[U] extends Record<string, unknown>
    ? DeepCamelCaseKeys<T[U]>
    : T[U];
};
