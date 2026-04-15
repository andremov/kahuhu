import { z } from "zod";
import type { Quiz } from "./types";

export const questionOptionSchema = z.object({
  text: z.string().min(1, "Option text required"),
  points: z.number().int().min(0),
});

export const questionSchema = z.object({
  id: z.string().min(1),
  statement: z.string().min(1, "Question text required"),
  options: z.array(questionOptionSchema).min(2).max(4),
  timeLimit: z.number().int().min(5).max(120),
});

export const quizSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  questions: z.array(questionSchema).min(1),
});

export function parseQuiz(raw: unknown): Quiz {
  return quizSchema.parse(raw) as Quiz;
}

export function safeParseQuiz(raw: unknown) {
  return quizSchema.safeParse(raw);
}
