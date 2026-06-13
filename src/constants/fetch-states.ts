import { RequestGenericReturn } from "@/db/types";

export const FETCH_LIMIT = 10;

export const defaultFetchState = {
  message: "",
  details: "",
  error: null,
} satisfies Omit<RequestGenericReturn, "data">;
