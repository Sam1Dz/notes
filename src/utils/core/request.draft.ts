import jwt from 'jsonwebtoken';

import { ApiError } from '~/utils/shared/error';

type OptionsType = RequestInit & {
  withAuth?: boolean;
  formData?: FormData;
  isBlob?: boolean;
  accessToken?: string;
  refreshToken?: string;
  onTokenRefresh?: (newAccessToken: string, newRefreshToken: string) => void;
};

/**
 * Makes an HTTP request with proper error handling and optional authentication.
 *
 * @param url - The URL to fetch
 * @param options - Request options including withAuth, formData, isBlob, and auth tokens
 * @returns The response data or void for 204 responses
 * @throws ApiError for failed requests
 */
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
  const {
    withAuth,
    formData,
    isBlob,
    accessToken,
    refreshToken,
    onTokenRefresh,
    ...otherOptions
  } = allOptions;

  if (!formData) {
    headers.set('Content-Type', 'application/json');
  }

  if (isBlob) {
    headers.set('Accept', 'application/octet-stream');
  }

  if (withAuth && accessToken) {
    // Check if token is close to expiration (5 minutes before)
    try {
      const decoded = jwt.decode(accessToken) as jwt.JwtPayload;
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = decoded.exp!;
      const clientExpiresAt = expiresAt - 60 * 5; // 5 minutes before expiration

      if (now > clientExpiresAt && refreshToken && onTokenRefresh) {
        // Token is close to expiration, attempt refresh
        try {
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessToken,
              refreshToken,
            }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const newAccessToken = refreshData.data.token.access;
            const newRefreshToken = refreshData.data.token.refresh;

            // Call the token refresh callback
            onTokenRefresh(newAccessToken, newRefreshToken);

            // Use the new access token
            headers.set('Authorization', `Bearer ${newAccessToken}`);
          } else {
            // Refresh failed, use current token (will likely fail)
            headers.set('Authorization', `Bearer ${accessToken}`);
          }
        } catch {
          // Refresh failed, use current token
          headers.set('Authorization', `Bearer ${accessToken}`);
        }
      } else {
        // Token is still valid
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
    } catch {
      // Token decode failed, use as-is
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
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

  const data = isBlob ? await response.blob() : await response.json();

  if (!response.ok) {
    const error = new ApiError(
      `[Request] Failed to fetch ${response.url}`,
      response.status,
    );

    error.fromResponse(data);
    throw error;
  }

  return data;
}
