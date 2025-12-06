import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isExpired = (date: Date | number) => {
  return new Date(date).valueOf() - new Date().valueOf() < 0;
};

export const getErrorDetails = ({ error, defaultMessage }: { error: unknown; defaultMessage?: string }) => {
  const genericMessage = defaultMessage || "Data request has failed.";
  return error instanceof Error ? error.message : genericMessage;
};
