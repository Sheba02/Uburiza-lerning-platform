import { Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const enroll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId, accessCode } = req.body;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) { res.status(404).json({ message: "Course not found" }); return; }

    if (!course.isFree) {
      if (!accessCode) { res.status(400).json({ message: "Access code required for paid course" }); return; }
      const code = await prisma.accessCode.findUnique({ where: { code: accessCode } });
      if (!code || code.courseId !== courseId) { res.status(400).json({ message: "Invalid access code" }); return; }
      if (code.usedCount >= code.maxUses) { res.status(400).json({ message: "Access code exhausted" }); return; }
      if (code.expiresAt && new Date() > code.expiresAt) { res.status(400).json({ message: "Access code expired" }); return; }
      await prisma.accessCode.update({ where: { id: code.id }, data: { usedCount: { increment: 1 } } });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId },
    });
    res.status(201).json(enrollment);
  } catch (err) {
    next(err);
  }
};

export const getMyCourses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user!.id },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: { include: { progress: { where: { userId: req.user!.id } } } },
              },
              orderBy: { orderIndex: "asc" },
            },
          },
        },
      },
    });
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
};
