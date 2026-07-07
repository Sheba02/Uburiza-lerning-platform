import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";

export const getLearners = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const learners = await prisma.user.findMany({
      where: { role: "LEARNER" },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    res.json(learners);
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalLearners, totalEnrollments, completedEnrollments] = await Promise.all([
      prisma.user.count({ where: { role: "LEARNER" } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { completedAt: { not: null } } }),
    ]);
    res.json({
      totalLearners,
      totalEnrollments,
      completionRate: totalEnrollments
        ? `${Math.round((completedEnrollments / totalEnrollments) * 100)}%`
        : "0%",
    });
  } catch (err) {
    next(err);
  }
};

export const generateAccessCodes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId, count = 10, maxUses = 1, expiresAt } = req.body;
    const codes = Array.from({ length: count }, () => ({
      code: uuidv4().split("-")[0].toUpperCase(),
      courseId,
      maxUses,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }));
    await prisma.accessCode.createMany({ data: codes });
    res.status(201).json({ created: codes.length, codes: codes.map((c) => c.code) });
  } catch (err) {
    next(err);
  }
};

export const exportLearners = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const learners = await prisma.user.findMany({
      where: { role: "LEARNER" },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    const csv = [
      "id,name,email,createdAt",
      ...learners.map((l) => `${l.id},${l.name},${l.email},${l.createdAt}`),
    ].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=learners.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
