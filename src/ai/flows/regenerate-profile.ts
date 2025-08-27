'use server';
/**
 * @fileOverview Regenerates a professional profile based on existing data to help land a job.
 *
 * - regenerateProfile - A function that handles the profile regeneration process.
 * - RegenerateProfileInput - The input type for the regenerateProfile function.
 * - RegenerateProfileOutput - The return type for the regenerateProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {ProfileSchema} from '@/lib/types';

const RegenerateProfileInputSchema = ProfileSchema.pick({
  name: true,
  workExperience: true,
  education: true,
  skills: true,
  industry: true,
}).describe("The user's existing profile data.");

export type RegenerateProfileInput = z.infer<typeof RegenerateProfileInputSchema>;

const RegenerateProfileOutputSchema = z.object({
  headline: z.string().describe('A new, catchy, and professional headline.'),
  summary: z.string().describe('A new, compelling professional summary (2-4 paragraphs).'),
  enhancedWorkExperience: z.string().describe('An enhanced version of the work experience section, highlighting achievements using action verbs.'),
});

export type RegenerateProfileOutput = z.infer<typeof RegenerateProfileOutputSchema>;

export async function regenerateProfile(input: RegenerateProfileInput): Promise<RegenerateProfileOutput> {
  return regenerateProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'regenerateProfilePrompt',
  input: {schema: RegenerateProfileInputSchema},
  output: {schema: RegenerateProfileOutputSchema},
  prompt: `You are an expert LinkedIn profile writer with a talent for crafting profiles that get candidates hired within a week.

Given the user's profile information, regenerate the headline, summary, and work experience to be more impactful and professional.

**Goal:** Create a profile that will attract recruiters and land the user a job in under 7 days.

**Instructions:**
1.  **Headline:** Create a powerful and keyword-rich headline.
2.  **Summary:** Write a compelling 2-4 paragraph summary that tells a story, showcases passion, and highlights key achievements.
3.  **Work Experience:** Rewrite the work experience to focus on accomplishments, not just responsibilities. Use the STAR method (Situation, Task, Action, Result) where possible and start bullet points with strong action verbs. Quantify results with numbers and metrics.

**User's Profile Data:**
- Name: {{name}}
- Target Industry: {{industry}}
- Education: {{education}}
- Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Work Experience:
{{{workExperience}}}
`,
});

const regenerateProfileFlow = ai.defineFlow(
  {
    name: 'regenerateProfileFlow',
    inputSchema: RegenerateProfileInputSchema,
    outputSchema: RegenerateProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
