import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().describe('The name of the task or assignment.'),
  deadline: z.string().optional().describe('The deadline for the task, formatted as YYYY-MM-DD. If unknown, leave undefined.'),
  estimatedMin: z.coerce.number().optional().describe('Estimated duration to complete the task in minutes.'),
  priority: z.string().optional().describe('The priority of the task (LOW, MEDIUM, HIGH).'),
});

export type CreateTaskArgs = z.infer<typeof CreateTaskSchema>;
