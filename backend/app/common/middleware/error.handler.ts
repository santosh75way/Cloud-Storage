// import { Request, Response, NextFunction } from 'express';
// import { errorResponse, JsonValue } from '@/common/types/response.type';

// export interface AppError extends Error {
//   statusCode?: number;
//   details?: JsonValue;
// }

// export const errorHandler = (
//   error: AppError,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const statusCode = error.statusCode || 500;
//   const message = error.message || 'Internal server error';

//   console.error(`[Error] ${statusCode} - ${message}`);
//   if (error.stack && process.env.NODE_ENV === 'development') {
//     console.error(error.stack);
//   }

//   res.status(statusCode).json(errorResponse(message, error.details));
// };


import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors: error.flatten(),
    });
  }

  const isAppError = error instanceof AppError || (error && typeof error === 'object' && 'name' in error && (error as any).name === 'AppError');

  if (isAppError) {
    const appErr = error as AppError;
    return res.status(appErr.statusCode || 500).json({
      success: false,
      message: appErr.message,
      code: appErr.code || "INTERNAL_SERVER_ERROR",
      details: appErr.details ?? null,
    });
  }

  return res.status(500).json({
    success: false,
    message: error instanceof Error ? error.message : "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    details: error instanceof Error ? error.stack : error,
  });
}