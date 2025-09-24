import { ApiError } from '../shared/error';

type OptionsType = RequestInit & {
  withAuth?: boolean;
  formData?: FormData;
};

export async function request(
  url: string | URL | globalThis.Request,
  options?: OptionsType,
) {
  const allOptions = {
    withAuth: false,
    ...options,
  };

  const controller = new AbortController();
  const timeout = setTimeout(
    () => {
      controller.abort();
    },
    Number(process.env.NEXT_PUBLIC_DEFAULT_REQUEST_TIMEOUT_DURATION) || 30000,
  );

  const headers = new Headers(allOptions.headers);
  const { withAuth, formData, ...otherOptions } = allOptions;

  if (!formData) {
    headers.set('Content-Type', 'application/json');
  }

  if (withAuth) {
    /**
     * Handle withAuth here, for example:
     * - Add Authorization header
     */
  }

  const response = await fetch(url, {
    ...otherOptions,
    body: formData || otherOptions?.body,
    headers,
    signal: AbortSignal.any(
      [otherOptions?.signal, controller.signal].filter(
        (signal): signal is AbortSignal => signal !== undefined,
      ),
    ),
  });

  clearTimeout(timeout);

  if (response.status === 204) {
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new ApiError(
      `[Request] Failed to fetch ${response.url}`,
      response.status,
    );

    error.fromResponse(data);

    throw error;
  } else {
    return data;
  }
}
