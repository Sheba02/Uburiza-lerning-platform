import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const getUserCertificates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.params.userId },
      include: { course: true },
    });
    res.json(certificates);
  } catch (err) {
    next(err);
  }
};

export const verifyCertificate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { certificateUid: req.params.uid },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
      },
    });
    if (!cert) { res.status(404).json({ message: "Certificate not found" }); return; }
    res.json(cert);
  } catch (err) {
    next(err);
  }
};

export const generateCertificate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.body;
    const userId = req.user!.id;

    const lessons = await prisma.lesson.findMany({ where: { module: { courseId } } });
    const completedCount = await prisma.progress.count({
      where: { userId, lessonId: { in: lessons.map((l) => l.id) }, completed: true },
    });

    if (completedCount < lessons.length) {
      res.status(400).json({ message: "Course not fully completed" });
      return;
    }

    const existing = await prisma.certificate.findFirst({ where: { userId, courseId } });
    if (existing) { res.json(existing); return; }

    const cert = await prisma.certificate.create({
      data: { userId, courseId, certificateUid: uuidv4() },
      include: { user: true, course: true },
    });

    await prisma.enrollment.updateMany({
      where: { userId, courseId },
      data: { completedAt: new Date() },
    });

    res.status(201).json(cert);
  } catch (err) {
    next(err);
  }
};
