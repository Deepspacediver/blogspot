import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isExpired = (date: Date | number) => {
  return new Date(date).valueOf() - new Date().valueOf() < 0;
};

export const getErrorDetails = ({ error, defaultMessage }: { error: unknown; defaultMessage?: string; }) => {
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

type APIResponseProps<T> = {
  data?: T;
  res?: typeof Response;
  status?: number;
};

export const APIResponse = <T = null>({ res = Response, data, status = 200 }: APIResponseProps<T>) => {
  return res.json(data, {
    status,
  });
};

const UPPER_CASE_LETTER_REGEX = /(?=[A-Z])/;

export const stringCamelCaseToSnakeCase = (key: string) => {
  return key.split(UPPER_CASE_LETTER_REGEX).join("_").toLowerCase();
};

export const parseCreateQueryDependencies = <T extends Record<PropertyKey, T[keyof T]>, P extends Record<keyof T, string>>({
  data,
  propertyMap,
}: {
  data: T;
  propertyMap?: P;
}) => {
  const dataWithoutUndefined = Object.entries(data).filter(([, val]) => val !== undefined);
  const { columns, values, pgIndices } = dataWithoutUndefined.reduce<{
    columns: string[];
    pgIndices: `$${number}`[];
    values: T[keyof T][];
  }>(
    (acc, curr, i) => {
      const [key, val] = curr;
      const correctKey = propertyMap && propertyMap[key] ? propertyMap[key] : key;
      const snakeCaseKey = stringCamelCaseToSnakeCase(correctKey);
      const pgIndex = `$${i + 1}` satisfies `$${number}`;
      acc.values.push(val);
      acc.columns.push(snakeCaseKey);
      acc.pgIndices.push(pgIndex);
      return acc;
    },
    {
      columns: [],
      values: [],
      pgIndices: [],
    },
  );
  const endIndex = columns.length;
  const columnsString = columns.join(", ");
  const pgIndicesString = pgIndices.join(", ");
  return { columnsString, values, pgIndicesString, endIndex };
};

export const parseUpdateQueryDependencies = <T extends Record<PropertyKey, T[keyof T]>>(data: T) => {
  const columnNames = Object.entries(data)
    .filter(([_, val]) => val !== undefined)
    .map(([key], i) => `${key} = $${i + 1}`)
    .join(", ");
  const columnValues = [...Object.entries(data).flatMap(([_, val]) => (!!val ? [val] : []))];
  const endIndex = columnNames.length;
  return {
    columnNames,
    columnValues,
    endIndex,
  };
};

export const logger = (data: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.dir({ data }, { depth: null });
  }
};