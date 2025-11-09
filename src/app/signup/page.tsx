import React from "react";

export default function SignUp() {
  return (
    <div>
      <h1>Signup form</h1>
      <form action="">
        <label htmlFor="email">Enter email</label>
        <input name="email" type="email" />

        <label htmlFor="password">Enter password</label>
        <input type="password" name="password" />
      </form>
    </div>
  );
}
