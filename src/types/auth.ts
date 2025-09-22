import type { EntityType } from './core/entity';

import type { LoginSchema, RegisterSchema } from '~/schemas/auth';

export interface LoginResponse {
  user: EntityType &
    Omit<LoginSchema, 'password'> & {
      name: string;
      email: string;
    };
  token: {
    access: string;
    refresh: string;
  };
}

export type RegisterResponse = EntityType &
  Omit<RegisterSchema, 'password' | 'confirmPassword'>;
