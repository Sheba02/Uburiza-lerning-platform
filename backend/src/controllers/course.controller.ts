import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, level } = req.query as Record<string, string>;
    const courses = await prisma.course.findMany({
      where: {
        published: true,
        ...(category && { category }),
        ...(level && { level: level as any }),
      },
      include: { modules: { include: { lessons: true }, orderBy: { orderIndex: "asc" } } },
    });
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: { modules: { include: { lessons: { orderBy: { orderIndex: "asc" } } }, orderBy: { orderIndex: "asc" } } },
    });
    if (!course) { res.status(404).json({ message: "Course not found" }); return; }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const course = await prisma.course.create({ data: req.body });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const course = await prisma.course.update({ where: { id: req.params.id }, data: req.body });
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.course.update({ where: { id: req.params.id }, data: { published: false } });
    res.json({ message: "Course unpublished (soft deleted)" });
  } catch (err) {
    next(err);
  }
};
