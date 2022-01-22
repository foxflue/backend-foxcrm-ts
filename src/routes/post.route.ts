import express from "express";
import { postSchema } from "../schema/post.schema";
import postController from "./../controller/post.controller";
import authMiddleware from "./../middleware/auth.middleware";
import { validate } from "./../middleware/validate.middleware";

const router = express.Router();

router.route("/post").get(postController.index).post(
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  // validator,
  validate(postSchema),
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
