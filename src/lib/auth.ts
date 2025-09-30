import type { LoginResponse, LoginSchema } from './schemas/auth';
import type { ResponseType } from './utils/api/response';

import { request } from './utils/http/request';
import { generateUrl } from './utils/http/uri';

export async function signIn(
  credentials: LoginSchema,
): Promise<ResponseType<LoginResponse>> {
  return await request(generateUrl('auth/signin'), {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
