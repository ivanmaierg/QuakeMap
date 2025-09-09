import { z } from 'zod';

export const SuccessResponseSchema = z.object({
  data: z.any().describe('Response data'),
  meta: z.object({
    total: z.number().optional().describe('Total number of items'),
    limit: z.number().optional().describe('Maximum number of items requested'),
    generated: z.string().datetime().optional().describe('Response generation timestamp')
  }).optional().describe('Response metadata'),
  links: z.object({
    self: z.string().describe('Link to current resource'),
    next: z.string().optional().describe('Link to next page'),
    prev: z.string().optional().describe('Link to previous page')
  }).optional().describe('Resource links')
});

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
