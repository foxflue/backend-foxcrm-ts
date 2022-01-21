import express from "express";
import leadController from "./../controller/lead.controller";
// import validator from './validator.js';
import authMiddleware from "./../middleware/auth.middleware";
// import checkCaptcha from './../../middlewares/recaptchaMiddleware.js';
const router = express.Router();

router
  .route("/lead")
  .get(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    leadController.index
  )
  .post(
    //   [checkCaptcha, validator],
    leadController.store
  );

export default router;
