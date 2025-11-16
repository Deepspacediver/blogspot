export enum UserRole {
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
  picture_url?: string;
  role: UserRole;
};

export type Comment = {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: Date;
  updated_at?: Date;
};

export type Post = {
  id: string;
  title: string;
  // Content would probably be html that is stringified
  content: string;
  author_id: string;
  created_at: Date;
  updated_at?: Date;
  // default false
  is_published: boolean;
};

export type File = {
  id: string;
  // unique constaint
  name: string;
  post_id: string;
  created_at: Date;
  size: number;
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

export type UserCK = DeepCamelCaseKeys<User>;

export type CommentCK = DeepCamelCaseKeys<Comment>;

export type PostCK = DeepCamelCaseKeys<Post>;

export type FileCK = DeepCamelCaseKeys<File>;
