import express from "express";
import { userDetailsSchema } from "../schema/auth.schema";
import UserController from "./../controller/user.controller";
import authMiddleware from "./../middleware/auth.middleware";
import { validate } from "./../middleware/validate.middleware";

const router = express.Router();

router
  .route("/user")
  .get(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    UserController.index
  )
  .post(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    [validate(userDetailsSchema)],
    UserController.store
  );

router.get(
  "/user/dashboard",
  authMiddleware.checkLogin,
  UserController.dashboard
);
router
  .route("/user/:id")
  .get(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    UserController.show
  )
  .delete(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    UserController.destroy
  );

export default router;
