import { RequestGenericReturn } from "@/db/types";

export const defaultFetchState = {
  message: "",
  details: "",
  error: null,
} satisfies Omit<RequestGenericReturn, "data">;
