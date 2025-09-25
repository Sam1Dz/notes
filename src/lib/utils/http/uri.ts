type PrimitiveValue = string | number | boolean;
type ArrayValue = PrimitiveValue[];
type ValidParamValue = PrimitiveValue | ArrayValue | null | undefined;

export type UrlParamsType = Record<string, ValidParamValue>;

/**
 * Generates a complete URL by combining a base URL, context path, and optional query parameters.
 * Defaults to '/api' as the base URL if not provided.
 *
 * @param context - The API endpoint context/path to append to the base URL.
 * @param params - Optional query parameters to include in the URL.
 * @param baseUrl - Optional base URL. Defaults to '/api'.
 * @returns The complete URL string with normalized path and query parameters.
 * @throws Error if URL construction fails.
 */
export function generateUrl(
  context: string,
  params?: UrlParamsType,
  baseUrl?: string,
): string {
  const base = baseUrl ?? '/api';

  try {
    const url = new URL(base);

    const normalizedPath = `${url.pathname}/${context}`.replace(/\/+/g, '/');

    url.pathname = normalizedPath;

    if (params) {
      url.search = generateParams(params);
    }

    return url.toString();
  } catch (error) {
    throw new Error(
      `Invalid URL construction: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Converts an object of parameters into a URL-encoded query string.
 * Handles arrays, null/undefined values, and converts all values to strings.
 *
 * @param params - The parameters object to convert to query string.
 * @returns The URL-encoded query string.
 */
export function generateParams(params: UrlParamsType): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          searchParams.append(key, String(item));
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}
