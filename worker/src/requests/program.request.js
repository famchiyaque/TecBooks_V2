import { z } from 'zod';

const projectInputSchema = z.object({
  name: z.string().trim().min(1),
  cbm: z.record(z.string(), z.any()),
});

export const createProgramRequestSchema = z.object({
  name: z.string().trim().min(1),
  projects: z.array(projectInputSchema).min(1).max(10),
});
