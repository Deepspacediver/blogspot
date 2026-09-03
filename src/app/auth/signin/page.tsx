"use client";

import { Button } from "@/components/ui/button";
import { FormMessage, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { defaultSignInState } from "@/constants/form-states";
import { handleSignIn } from "@/lib/actions/auth.actions";
import React, { useActionState } from "react";

export default function SignIn() {
  const [errorState, signInAction, isPending] = useActionState(handleSignIn, defaultSignInState);
  const prevFormState = errorState.prevFormState;
  const errors = errorState.fieldErrors;
  return (
    <div>
      <h1>Sign in form</h1>
      <form action={signInAction}>
        <Label htmlFor="email">Enter email</Label>
        <Input defaultValue={prevFormState?.email || ""} name="email" type="email" />
        <FormMessage messages={errors.email} />
        <Label htmlFor="password">Enter password</Label>
        <Input defaultValue={prevFormState?.password || ""} type="password" name="password" />
        <FormMessage messages={errors.password} />
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Submit
        </Button>
      </form>
    </div>
  );
}
