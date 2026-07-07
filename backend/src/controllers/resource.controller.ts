import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const getResources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, fileType } = req.query as Record<string, string>;
    const resources = await prisma.resource.findMany({
      where: {
        ...(category && { category }),
        ...(fileType && { fileType }),
      },
    });
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

export const createResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resource = await prisma.resource.create({ data: req.body });
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
};

export const deleteResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.resource.delete({ where: { id: req.params.id } });
    res.json({ message: "Resource deleted" });
  } catch (err) {
    next(err);
  }
};
