import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema, property: 'body' | 'query' | 'params' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (property === 'body') {
                req.body = await schema.parseAsync(req.body);
            } else if (property === 'query') {
                req.query = (await schema.parseAsync(req.query)) as any;
            } else if (property === 'params') {
                req.params = (await schema.parseAsync(req.params)) as any;
            }
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                const formattedErrors = (error as any).errors.map((e: any) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));

                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: formattedErrors,
                });
                return;
            }
            next(error);
        }
    };
};
