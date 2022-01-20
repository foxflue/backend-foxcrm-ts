import express from "express";
import projectController from "./../controller/project.controller";
import authMiddleware from "./../middleware/auth.middleware";

const router = express.Router();

router
  .route("/project")
  //   .get([authMiddleware.checkLogin], projectController.index)
  .post(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
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
