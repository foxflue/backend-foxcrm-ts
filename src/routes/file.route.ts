import express from "express";
import fileController from "./../controller/file.controller";
import authMiddleware from "./../middleware/auth.middleware";
const router = express.Router();

router
  .route("/file")
  //   .get(
  //     [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  //     fileController.index
  //   )
  .post(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    fileController.store
  );

router
  .route("/file/:id")
  .delete(
    [authMiddleware.checkLogin, authMiddleware.checkAdmin],
    fileController.destroy
  );

// router.post(
//   "/file/get-signed-url",
//   [authMiddleware.checkLogin, authMiddleware.checkAdmin],
//   fileController.getSignedUrl
// );

export default router;
