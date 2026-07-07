import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  isFree: z.boolean().optional(),
  price: z.number().optional(),
  published: z.boolean().optional(),
  thumbnailUrl: z.string().url().optional(),
});

export const progressSchema = z.object({
  lessonId: z.string().uuid(),
});

export const enrollSchema = z.object({
  courseId: z.string().uuid(),
  accessCode: z.string().optional(),
});

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }
    req.body = result.data;
    next();
  };
