import { envPublic } from '~/core/config/env';

/**
 * Represents a primitive value that can be used in URL parameters.
 */
type PrimitiveValue = string | number | boolean;

/**
 * Represents an array of primitive values.
 */
type ArrayValue = PrimitiveValue[];

/**
 * Represents a valid parameter value, which can be a primitive, an array, or null/undefined.
 */
type ValidParamValue = PrimitiveValue | ArrayValue | null | undefined;

/**
 * Represents a record of URL parameters where keys are strings and values are valid parameter values.
 */
export type UrlParamsType = Record<string, ValidParamValue>;

/**
 * Generates a full URL by combining the base API URL with a context path and optional query parameters.
 * @param context - The context path to append to the base URL.
 * @param params - Optional query parameters to include in the URL.
 * @returns The generated URL as a string.
 */
export function generateUrl(context: string, params?: UrlParamsType): string {
  const url = new URL(envPublic.NEXT_PUBLIC_API_URL);

  url.pathname = url.pathname + '/' + context;
  url.pathname = url.pathname.replace(/\/+/g, '/');

  if (params) {
    url.search = generateParams(params);
  }

  return url.toString();
}

/**
 * Generates a query string from URL parameters.
 * @param params - The parameters to convert into a query string.
 * @returns The query string representation of the parameters.
 */
export function generateParams(params: UrlParamsType): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value || typeof value === 'boolean') {
      if (Array.isArray(value)) {
        value.forEach((value) => {
          searchParams.append(key, String(value));
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}
