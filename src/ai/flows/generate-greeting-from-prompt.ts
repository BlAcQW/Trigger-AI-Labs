'use server';

/**
 * @fileOverview A flow to generate a personalized greeting message from a prompt.
 *
 * - generateGreetingFromPrompt - A function that generates a greeting message from a prompt.
 * - GenerateGreetingFromPromptInput - The input type for the generateGreetingFromPrompt function.
 * - GenerateGreetingFromPromptOutput - The return type for the generateGreetingFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGreetingFromPromptInputSchema = z.object({
  prompt: z.string().describe('A short prompt to generate a greeting message from (e.g., \'summer sale\', \'new arrivals\').'),
});
export type GenerateGreetingFromPromptInput = z.infer<typeof GenerateGreetingFromPromptInputSchema>;

const GenerateGreetingFromPromptOutputSchema = z.object({
  greeting: z.string().describe('The generated personalized greeting message.'),
});
export type GenerateGreetingFromPromptOutput = z.infer<typeof GenerateGreetingFromPromptOutputSchema>;

export async function generateGreetingFromPrompt(input: GenerateGreetingFromPromptInput): Promise<GenerateGreetingFromPromptOutput> {
  return generateGreetingFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGreetingFromPromptPrompt',
  input: {schema: GenerateGreetingFromPromptInputSchema},
  output: {schema: GenerateGreetingFromPromptOutputSchema},
  prompt: `You are a helpful assistant that generates personalized greeting messages for a retail store. The goal is to attract customers passing by the store.

  Generate a greeting message based on the following prompt: {{{prompt}}}. The greeting message should be short and friendly.
  The generated greeting should entice the customer to enter the store.
  `,
});

const generateGreetingFromPromptFlow = ai.defineFlow(
  {
    name: 'generateGreetingFromPromptFlow',
    inputSchema: GenerateGreetingFromPromptInputSchema,
    outputSchema: GenerateGreetingFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
