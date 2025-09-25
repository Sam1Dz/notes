import { apiSuccess, internalServerError } from '~/lib/utils/api/response';
import { withDatabase } from '~/lib/utils/database/mongodb';

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
