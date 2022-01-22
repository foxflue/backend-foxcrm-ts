import express from "express";
import { validate } from "../middleware/validate.middleware";
import { projectSchema } from "../schema/project.schema";
import projectController from "./../controller/project.controller";
import authMiddleware from "./../middleware/auth.middleware";

const router = express.Router();

router
  .route("/project")
  .get([authMiddleware.checkLogin], projectController.index)
  .post(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    validate(projectSchema),
    projectController.store
  );
router
  .route("/project/:id")
  .get([authMiddleware.checkLogin], projectController.show)
  .patch(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    projectController.update
  )
  .delete(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    projectController.destroy
  );

export default router;
