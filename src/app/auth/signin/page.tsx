"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultSignInState } from "@/constants/form-states";
import { handleSignIn } from "@/lib/actions/auth.actions";
import React, { useActionState } from "react";

export default function SignIn() {
  const [errorState, signInAction] = useActionState(handleSignIn, defaultSignInState);
  const prevFormState = errorState.prevFormState;
  return (
    <div>
      <h1>Sign in form</h1>
      <form action={signInAction}>
        <Label htmlFor="email">Enter email</Label>
        <Input defaultValue={prevFormState?.email || ""} name="email" type="email" />
        <Label htmlFor="password">Enter password</Label>
        <Input defaultValue={prevFormState?.password || ""} type="password" name="password" />
        <button>Submit</button>
      </form>
    </div>
  );
}
