import { apiSuccess, internalServerError } from '~/shared/utils/api/response';
import { withDatabase } from '~/core/lib/database/mongodb';

export async function GET() {
  try {
    return await withDatabase(async () => {
      return apiSuccess('OK', 200, null, 'Database connected successfully');
    });
  } catch (error) {
    console.error('Database connection error:', error);

    return internalServerError(error);
  }
}
