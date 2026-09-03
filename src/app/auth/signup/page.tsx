"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormMessage, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { defaultSignupState } from "@/constants/form-states";
import { handleSignUp } from "@/lib/actions/auth.actions";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import React, { useActionState } from "react";

export default function SignUp() {
  const [errorState, signUpAction, isPending] = useActionState(handleSignUp, defaultSignupState);
  const prevFormState = errorState.prevFormState;
  const errors = errorState.fieldErrors;

  return (
    <Card className="w-full max-w-md bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm gap-6">
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>

      {errorState.message && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorState.message}</span>
        </div>
      )}

      <form action={signUpAction} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            defaultValue={prevFormState?.email || ""}
            required
          />
          <FormMessage messages={errors.email} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-foreground">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            defaultValue={prevFormState?.password || ""}
            required
          />
          <FormMessage messages={errors.password} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            defaultValue={prevFormState?.confirmPassword || ""}
            required
          />
          <FormMessage messages={errors.confirmPassword} />
        </div>

        <Button
          type="submit"
          variant="secondary"
          disabled={isPending}
          className="w-full mt-2 font-semibold"
        >
          {isPending && <Spinner />}
          {isPending ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground pt-2 border-t border-border/60">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
        >
          Sign in
        </Link>
      </div>
    </Card>
  );
}
