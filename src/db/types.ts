export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export type User = {
  id: number;
  email: string;
  username?: string;
  password: string;
  created_at: Date;
  updated_at?: Date;
  picture_url?: string;
  role: UserRole;
};

export type Comment = {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  created_at: Date;
  updated_at?: Date;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  short_description: string;
  author_id: number;
  created_at: Date;
  updated_at?: Date;
  image?: string;
  is_published: boolean;
};

export type File = {
  id: number;
  name: string;
  post_id: number;
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

export type OptionalReturn<T> = Promise<T | undefined>;

export type NullablePartial<T> = Partial<{
  [R in keyof T]: T[R] | null;
}>;

export type ErrorFields<T extends Record<PropertyKey, unknown>> = NullablePartial<{
  [R in keyof T]: string[];
}>;

// TODO FormState should be more extensive
export type FormState = Record<string, string | number | null | undefined>;
export type ActionState<T extends FormState> = {
  message: string;
  // TODO might not be needed
  error?: unknown;
  details: string;
  fieldErrors: ErrorFields<T>;
  prevFormState: NullablePartial<T>;
};

export type RequestGenericReturn = {
  data: Record<PropertyKey, unknown> | null;
  // TODO might not be needed
  error?: unknown;
  details?: string | null;
  message: string;
};
