import type { EntityType } from './core/entity';

import type { RegisterSchema } from '~/schemas/auth';

export type RegisterResponse = Omit<
  RegisterSchema,
  'password' | 'confirmPassword'
> &
  EntityType;
