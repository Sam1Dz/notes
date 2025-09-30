'use server';

import * as auth from '~/lib/auth';
import type { LoginSchema } from '~/lib/schemas/auth';

import { createSession } from './session';
import { ApiError } from './utils/api/error';
import { decodeAccessToken } from './utils/auth/jwt';

type ProviderType = 'credentials' | 'github';

export async function signIn(
  credentialType: ProviderType,
  credentials?: LoginSchema,
) {
  switch (credentialType) {
    case 'credentials':
      if (!credentials) {
        throw new Error('Credentials are required for credentials login');
      }

      try {
        const response = await auth.signIn(credentials);

        if (response.data) {
          const { data } = response;
          const decodedToken = decodeAccessToken(data.token.access);

          if (decodedToken === null) {
            return null;
          }

          await createSession({
            user: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
            },
            token: { access: data.token.access, refresh: data.token.refresh },
            exp: decodedToken.exp,
          });

          return data;
        }

        throw new Error();
      } catch (error) {
        if (error instanceof ApiError) {
          const message = error.errors.map((error) => error.detail).join(', ');

          throw new Error(message);
        }

        if (error instanceof Error) {
          throw new Error(error.message);
        }

        throw new Error('Login failed with unknown reason!');
      }

    case 'github':
      // Handle GitHub login
      break;
  }
}
