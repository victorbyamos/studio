'use server';
/**
 * @fileOverview Suggests relevant skills and keywords based on work history and industry.
 *
 * - suggestSkills - A function that suggests skills based on input.
 * - SuggestSkillsInput - The input type for the suggestSkills function.
 * - SuggestSkillsOutput - The return type for the suggestSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSkillsInputSchema = z.object({
  workHistory: z
    .string()
    .describe(
      'A detailed description of the user\'s work history, including job titles, responsibilities, and company descriptions.'
    ),
  industry: z.string().describe('The industry the user is targeting.'),
});
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

const SuggestSkillsOutputSchema = z.object({
  suggestedSkills: z
    .array(z.string())
    .describe(
      'A list of relevant skills and keywords to include in the profile.'
    ),
});
export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;

export async function suggestSkills(input: SuggestSkillsInput): Promise<SuggestSkillsOutput> {
  return suggestSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillsPrompt',
  input: {schema: SuggestSkillsInputSchema},
  output: {schema: SuggestSkillsOutputSchema},
  prompt: `You are a career advisor specializing in LinkedIn profile optimization.

Based on the user's work history and target industry, suggest relevant skills and keywords to include in their profile to improve visibility to recruiters.

Work History: {{{workHistory}}}
Industry: {{{industry}}}

Skills:`, // Keep prompt focused on skill suggestion
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
