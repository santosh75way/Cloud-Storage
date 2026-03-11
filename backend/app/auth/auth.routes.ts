import { Router, Request, Response } from 'express';
import { handleValidationErrors } from '@/common/middleware/validation';
import { authController } from './auth.controller';
import {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  updateProfileValidation,
} from './auth.validator';
import { authenticate } from '@/common';
import {
  loginLimiter,
  signupLimiter,
  forgotPasswordLimiter
} from '@/common/middleware/rateLimiter';

const router = Router();

// Public routes
router.post(
  '/signup',
  signupLimiter,
  signupValidation,
  handleValidationErrors,
  (req: Request, res: Response) => authController.signup(req, res)
);

router.post(
  '/login',
  loginLimiter,
  loginValidation,
  handleValidationErrors,
  (req: Request, res: Response) => authController.login(req, res)
);

router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  forgotPasswordValidation,
  handleValidationErrors,
  (req: Request, res: Response) => authController.forgotPassword(req, res)
);

router.post(
  '/reset-password',
  forgotPasswordLimiter,
  resetPasswordValidation,
  handleValidationErrors,
  (req: Request, res: Response) => authController.resetPassword(req, res)
);

router.post('/refresh-token', (req: Request, res: Response) => authController.refreshToken(req, res));

// Protected routes
router.get('/profile', authenticate, (req: Request, res: Response) => authController.getProfile(req, res));

router.put(
  '/profile',
  authenticate,
  updateProfileValidation,
  handleValidationErrors,
  (req: Request, res: Response) => authController.updateProfile(req, res)
);

router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  handleValidationErrors,
  (req: Request, res: Response) => authController.changePassword(req, res)
);

router.post('/logout', authenticate, (req: Request, res: Response) => authController.logout(req, res));

export default router;