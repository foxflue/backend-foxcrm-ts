import express from "express";
import authController from "./../controller/auth.controller";
import authMiddleware from "./../middleware/auth.middleware";
// import checkCaptcha from '../../middlewares/recaptchaMiddleware.js';

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/user", authMiddleware.checkLogin, authController.me);
router.post("/auth/logout", authMiddleware.checkLogin, authController.logout);
router.post("/auth/verify-email/:token", authController.verifyEmail);
router.post(
  "/auth/forgot-password",
  //   [checkCaptcha],
  authController.forgotPassword
);
router.post("/auth/reset-password/:token", authController.resetPassword);

export default router;
