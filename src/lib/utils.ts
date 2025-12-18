import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
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

export const formatDateToAppConvention = (data: Date | string | number) => {
  return format(new Date(data), "MMMM d, yyyy");
};

export const formatDateToDateTimeAttribute = (data: Date | string | number) => {
  return format(new Date(data), "yyyy-MM-dd kk:mm:ss");
};

export const getFormattedDateWithAttribute = (data: Date | string | number) => {
  const attributeDate = formatDateToDateTimeAttribute(data);
  const formattedDate = formatDateToAppConvention(data);
  return {
    attributeDate,
    formattedDate,
  };
};

type ClearCookiesProps = {
  cookieStore: ReadonlyRequestCookies;
  isAPI?: boolean;
};

export const clearJWTCookies = ({ cookieStore, isAPI = false }: ClearCookiesProps) => {
  cookieStore.delete("refresh").delete(isAPI ? "access" : "session");
};
