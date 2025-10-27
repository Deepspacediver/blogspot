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
  nest: {
    propert: string
  }
}


// TODO
// transform single string with single underscore into string without underscore 
// remove all underscores from string type
// transform every letter after removed underscore into uppercase 
// keep first letter in lowercase 
// transform property of object from snake case to camelcase
// transform everty property of object form snake to camelcase
// transform nested object properties from snake to camelcase

type Underscore = "_"

type WithoutFirstUnderscore<T extends string> = T extends `_${infer Rest}` ? Rest : T
type SingleSnakeCaseString = "_underscore"

type UnderscorelessString = WithoutFirstUnderscore<SingleSnakeCaseString>

// Part 2
type MultipleUnderscoresString = `multiple_underscores_test`
type WithoutEveryUnderscore<T extends string> = T extends `${infer U}_${infer P}` ? WithoutEveryUnderscore<`${U}${Capitalize<P>}`> : T

type StringWithoutAllUnderscoreCapitalized = WithoutEveryUnderscore<MultipleUnderscoresString>


