import { VariantProps } from "class-variance-authority";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import React from "react";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

type LinkProps = NextLinkProps & {
  children?: React.ReactNode;
  className?: string;
} & VariantProps<typeof buttonVariants>;

export async function Link({ href, children, className, variant, size }: LinkProps) {
  return (
    <NextLink className={cn(buttonVariants({ variant, size, className }))} href={href}>
      {children}
    </NextLink>
  );
}
