import { apiSuccess, internalServerError } from '~/utils/core/api-response';
import { withDatabase } from '~/utils/core/mongodb';

export async function GET() {
  try {
    return withDatabase(async () => {
      return apiSuccess('OK', 200, null, 'Database connected successfully');
    });
  } catch (error) {
    console.error('Database connection error:', error);

    return internalServerError(error);
  }
}
