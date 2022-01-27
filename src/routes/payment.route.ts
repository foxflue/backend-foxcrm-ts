import express from "express";
import paymentController from "./../controller/payment.controller";
import authMiddleware from "./../middleware/auth.middleware";

const router = express.Router();

router
  .route("/payment")
  .get(paymentController.index)
  .post(authMiddleware.checkLogin, paymentController.store);
router
  .route("/payment/:id")
  .get([authMiddleware.checkLogin], paymentController.show);

router.post(
  "/payment/verify/:id",
  authMiddleware.checkLogin,
  paymentController.verifyPayment
);

export default router;
