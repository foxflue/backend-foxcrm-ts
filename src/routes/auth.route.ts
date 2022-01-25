import express from "express";
// import checkCaptcha from './../middleware/recaptcha.middleware';
import { validate } from "../middleware/validate.middleware";
import { authSchema } from "../schema/auth.schema";
import authController from "./../controller/auth.controller";
import authMiddleware from "./../middleware/auth.middleware";

const router = express.Router();

router.post("/auth/register", [validate(authSchema)], authController.register); // captcha
router.post("/auth/login", authController.login); // captcha
router.get("/auth/user", authMiddleware.checkLogin, authController.me);
router.post("/auth/logout", authMiddleware.checkLogin, authController.logout);
// router.post("/auth/verify-email/:token", authController.verifyEmail);
router.post(
  "/auth/forgot-password",
  //   [checkCaptcha],
  authController.forgotPassword
);
router.post("/auth/reset-password/:token", authController.resetPassword);

export default router;
