'use server';

/**
 * @fileOverview Summarizes detection history to provide insights for store owners.
 *
 * - summarizeDetectionHistory - A function that generates a summary of detection events.
 * - SummarizeDetectionHistoryInput - The input type for the summarizeDetectionHistory function.
 * - SummarizeDetectionHistoryOutput - The return type for the summarizeDetectionHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDetectionHistoryInputSchema = z.object({
  detectionHistory: z.string().describe('A list of detection events in JSON format.'),
});
export type SummarizeDetectionHistoryInput = z.infer<typeof SummarizeDetectionHistoryInputSchema>;

const SummarizeDetectionHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the detection events, highlighting peak hours and common demographics.'),
});
export type SummarizeDetectionHistoryOutput = z.infer<typeof SummarizeDetectionHistoryOutputSchema>;

export async function summarizeDetectionHistory(input: SummarizeDetectionHistoryInput): Promise<SummarizeDetectionHistoryOutput> {
  return summarizeDetectionHistoryFlow(input);
}

const summarizeDetectionHistoryPrompt = ai.definePrompt({
  name: 'summarizeDetectionHistoryPrompt',
  input: {schema: SummarizeDetectionHistoryInputSchema},
  output: {schema: SummarizeDetectionHistoryOutputSchema},
  prompt: `You are an AI assistant helping a store owner understand customer traffic patterns.
  Summarize the following detection history, highlighting peak hours, common demographics, and any other relevant insights that could help optimize staffing and marketing efforts.
  \nDetection History: {{{detectionHistory}}}
  \nSummary:`, 
});

const summarizeDetectionHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeDetectionHistoryFlow',
    inputSchema: SummarizeDetectionHistoryInputSchema,
    outputSchema: SummarizeDetectionHistoryOutputSchema,
  },
  async input => {
    const {output} = await summarizeDetectionHistoryPrompt(input);
    return output!;
  }
);
