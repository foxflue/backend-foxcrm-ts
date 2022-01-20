import express from "express";
import postController from "./../controller/post.controller";
// import validator from './validator.js';
import authMiddleware from "./../middleware/auth.middleware";

const router = express.Router();

router
  .route("/post")
  //   .get(postController.index)
  .post(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    // validator,
    postController.store
  );
router
  .route("/post/:slug")
  .get(postController.show)
  .patch(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    postController.update
  )
  .delete(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    postController.destroy
  );

export default router;
