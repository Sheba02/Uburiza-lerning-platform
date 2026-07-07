import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
};

export default errorHandler;
