import { Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const markComplete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonId } = req.body;
    const userId = req.user!.id;

    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed: true, completedAt: new Date() },
      create: { userId, lessonId, completed: true, completedAt: new Date() },
    });
    res.json(progress);
  } catch (err) {
    next(err);
  }
};

export const getCourseProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.user!.id;

    const lessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
      include: { progress: { where: { userId } } },
    });

    const total = lessons.length;
    const completed = lessons.filter((l) => l.progress[0]?.completed).length;

    res.json({
      total,
      completed,
      percentage: total ? Math.round((completed / total) * 100) : 0,
      lessons,
    });
  } catch (err) {
    next(err);
  }
};
