import { Request, Response, NextFunction } from "express";

export const errorHandlerDev = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

export const errorHandlerProd = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || 500).json({
    status: err.statusCode,
    message: err.message,
  });
};
