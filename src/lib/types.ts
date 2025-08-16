import { z } from 'zod';

export const ProfileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  contactDetails: z.string(),
  summary: z.string(),
  workExperience: z.string(),
  education: z.string(),
  skills: z.array(z.string()),
  industry: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;
