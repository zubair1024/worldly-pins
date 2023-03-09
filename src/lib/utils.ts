import { NextApiResponse } from 'next';
import z from 'zod';
import { fromZodError } from 'zod-validation-error';

export function handleError(res: NextApiResponse, err: unknown) {
  if (err instanceof z.ZodError) {
    const validationError = fromZodError(err);
    return res.status(401).json({
      error: true,
      success: false,
      errMessage: validationError.message,
    });
  } else if (err instanceof Error) {
    return res.status(500).json({
      error: true,
      success: false,
      errMessage: err.message,
    });
  }
  return res.status(500).json({
    error: true,
    success: false,
    errMessage: 'Internal Server Error',
  });
}
