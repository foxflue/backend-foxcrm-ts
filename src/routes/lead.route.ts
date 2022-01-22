import express from "express";
// import checkCaptcha from "../middleware/recaptcha.middleware";
import { validate } from "../middleware/validate.middleware";
import { leadSchema } from "../schema/lead.schema";
import leadController from "./../controller/lead.controller";
import authMiddleware from "./../middleware/auth.middleware";
const router = express.Router();

router
  .route("/lead")
  .get(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    leadController.index
  )
  .post(
    //   [checkCaptcha],
    validate(leadSchema),
    leadController.store
  );

export default router;
