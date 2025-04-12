import * as z from "zod";

export const createSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  collaborators: z.array(z.string()),
});

export const getAllSchema = z.object({
  pageNo: z.number().optional(),
  skip: z.number().optional(),
});

export const getByIdSchema = z.object({
  id: z.string(),
});

export const getAnswerToQuestionSchema = z.object({
  question: z.string(),
  projectId: z.string(),
});
