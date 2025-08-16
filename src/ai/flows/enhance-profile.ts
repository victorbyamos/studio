// EnhanceProfile AI agent.
//
// - enhanceProfile - A function that handles the profile enhancement process.
// - EnhanceProfileInput - The input type for the enhanceProfile function.
// - EnhanceProfileOutput - The return type for the enhanceProfile function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceProfileInputSchema = z.object({
  profileData: z.string().describe('The profile data to enhance.'),
});

export type EnhanceProfileInput = z.infer<typeof EnhanceProfileInputSchema>;

const EnhanceProfileOutputSchema = z.object({
  enhancedProfile: z.string().describe('The enhanced profile data.'),
});

export type EnhanceProfileOutput = z.infer<typeof EnhanceProfileOutputSchema>;

export async function enhanceProfile(input: EnhanceProfileInput): Promise<EnhanceProfileOutput> {
  return enhanceProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceProfilePrompt',
  input: {schema: EnhanceProfileInputSchema},
  output: {schema: EnhanceProfileOutputSchema},
  prompt: `You are an expert in writing LinkedIn profiles. You will receive the profile data and suggest improvements to wording, grammar, and overall profile presentation.

Profile Data: {{{profileData}}}`,
});

const enhanceProfileFlow = ai.defineFlow(
  {
    name: 'enhanceProfileFlow',
    inputSchema: EnhanceProfileInputSchema,
    outputSchema: EnhanceProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
