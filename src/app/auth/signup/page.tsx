"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleSignUp, SignUpState } from "@/lib/actions/auth.actions";
import React, { useActionState } from "react";

const defaultSingupState = {
  message: "",
  fieldErrors: {},
  prevFormState: { email: "", password: "", confirmPassword: "" },
} satisfies SignUpState;

export default function SignUp() {
  const [errorState, signUpAction] = useActionState(handleSignUp, defaultSingupState);
  const prevFormState = errorState.prevFormState;
  return (
    <div>
      <h1>Signup form</h1>
      <form action={signUpAction}>
        <Label htmlFor="email">Enter email</Label>
        <Input defaultValue={prevFormState?.email || ""} name="email" type="email" />
        <Label htmlFor="password">Enter password</Label>
        <Input defaultValue={prevFormState?.password || ""} type="password" name="password" />
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input defaultValue={prevFormState?.confirmPassword || ""} type="password" name="confirmPassword" />
        <button>Submit</button>
      </form>
    </div>
  );
}
