enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER"
}

export type User = {
  _id: string,
  email: string;
  username?: string,
  password: string,
  created_at: Date,
  updated_at?: Date,
  // todo subject to change
  picture?: string,
  role: UserRole,
};


// TODO
// transform single string with single underscore into string without underscore ✅
// remove all underscores from string type ✅
// transform every letter after removed underscore into uppercase  ✅
// keep first letter in lowercase ✅
// transform property of object from snake case to camelcase ✅
// transform everty property of object form snake to camelcase ✅
// transform nested object properties from snake to camelcase ✅
// add case _id_another_name -> idAnotherName

type Underscore = "_";
type CamelCaseString = `_${string}`;

type WithoutFirstUnderscore<T extends string> = T extends `_${infer Rest}` ? Rest : T;
type SingleSnakeCaseString = "_underscore";

type UnderscorelessString = WithoutFirstUnderscore<SingleSnakeCaseString>;

// Part 2
type CamelCasePKey<T extends string> = T extends `_${infer U}` ? Lowercase<U> : T extends `_${infer U}_${infer P}` ? `${U}${Capitalize<CamelCasePKey<P>>}` : T extends `${infer U}_${infer P}` ? CamelCasePKey<`${U}${Capitalize<P>}`> : T;

type FirstAsLowerCaseId = CamelCasePKey<"_id_private_key">;
type NoFirstUnderscoleAsLowerCaseId = CamelCasePKey<"id_private_key">;
type SimplePrivateId = CamelCasePKey<"_id">;

type ObjectWithCamelCaseProperties<T extends Record<string, unknown>> = {
  [U in keyof T as CamelCasePKey<U extends string & keyof T ? U : never>]: T[U] extends Record<string, unknown> ? ObjectWithCamelCaseProperties<T[U]> : T[U]
}

