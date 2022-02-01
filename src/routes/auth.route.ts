import express from "express";
// import checkCaptcha from './../middleware/recaptcha.middleware';
import { validate } from "../middleware/validate.middleware";
import { userDetailsSchema, userPasswordSchema } from "../schema/auth.schema";
import authController from "./../controller/auth.controller";
import authMiddleware from "./../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/auth/register",
  [validate(userDetailsSchema), validate(userPasswordSchema)],
  authController.register
); // captcha
router.post("/auth/login", authController.login); // captcha
router.post("/auth/oauth-login/:id", authController.socialLogin);
router.post(
  "/auth/two-fa",
  [authMiddleware.checkLogin],
  authController.set2FAMode
);
router.post("/auth/two-fa-verify/:id/:otp", authController.verify2FASecret);
router.get("/auth/user", authMiddleware.checkLogin, authController.me);
router.post("/auth/verify-email/:token", authController.verifyEmail);
router.post("/auth/resend-verify-email", authController.resendVerifyEmail);
router.post(
  "/auth/forgot-password",
  //   [checkCaptcha],
  authController.forgotPassword
);
router.post(
  "/auth/reset-password/:token",
  [validate(userPasswordSchema)],
  authController.resetPassword
);
router.post(
  "/auth/password-change",
  [authMiddleware.checkLogin],
  [validate(userPasswordSchema)],
  authController.changePassword
);

router.post("/auth/logout", authMiddleware.checkLogin, authController.logout);
export default router;
