
'use server';

/**
 * @fileOverview An AI tool that analyzes the SDR's progress and suggests which tasks to prioritize based on their impact on meeting the weekly goal.
 *
 * - prioritizeTasks - A function that handles the task prioritization process.
 * - PrioritizeTasksInput - The input type for the prioritizeTasks function.
 * - PrioritizeTasksOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeTasksInputSchema = z.object({
  weeklyGoal: z.number().describe('The SDRs weekly goal for number of meetings.'),
  meetingsBooked: z.number().describe('The number of meetings the SDR has booked so far this week.'),
  tasksCompleted: z.number().describe('The number of tasks the SDR has completed today.'),
  tasksRemaining: z.array(z.string()).describe('A list of the tasks remaining for the SDR to complete today.'),
});
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizeTasksOutputSchema = z.object({
  prioritizedTasks: z.array(z.string()).describe('A list of the tasks to prioritize, in order of importance.'),
  reasoning: z.string().describe('The AI reasoning for prioritizing the tasks.'),
});
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

export async function prioritizeTasks(input: PrioritizeTasksInput): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are an AI assistant helping SDRs prioritize their tasks to meet their weekly goals.

You will receive the SDRs weekly goal for number of meetings, the number of meetings they have booked so far this week, the number of tasks they have completed today, and a list of the tasks remaining for them to complete today.

Based on this information, you will provide a prioritized list of tasks for the SDR to focus on, and the reasoning for your prioritization.

Weekly Goal: {{{weeklyGoal}}}
Meetings Booked: {{{meetingsBooked}}}
Tasks Completed: {{{tasksCompleted}}}
Tasks Remaining: {{#each tasksRemaining}}- {{{this}}}
{{/each}}

Prioritized Tasks:`,
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
