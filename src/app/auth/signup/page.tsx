"use client";

import { Button } from "@/components/ui/button";
import { FormMessage, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { defaultSignupState } from "@/constants/form-states";
import { handleSignUp } from "@/lib/actions/auth.actions";
import React, { useActionState } from "react";

export default function SignUp() {
  const [errorState, signUpAction, isPending] = useActionState(handleSignUp, defaultSignupState);
  const prevFormState = errorState.prevFormState;
  const errors = errorState.fieldErrors;
  return (
    <div>
      <h1>Signup form</h1>
      <form action={signUpAction}>
        <Label htmlFor="email">Enter email</Label>
        <Input defaultValue={prevFormState?.email || ""} name="email" type="email" />
        <FormMessage messages={errors.email} />
        <Label htmlFor="password">Enter password</Label>
        <Input defaultValue={prevFormState?.password || ""} type="password" name="password" />
        <FormMessage messages={errors.password} />
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input defaultValue={prevFormState?.confirmPassword || ""} type="password" name="confirmPassword" />
        <FormMessage messages={errors.confirmPassword} />
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Submit
        </Button>
      </form>
    </div>
  );
}
