import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  error: z.string().describe('Error message'),
  details: z.string().optional().describe('Additional error details'),
  code: z.string().optional().describe('Error code'),
  timestamp: z.string().datetime().optional().describe('Error timestamp')
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
