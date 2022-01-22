import express from "express";
import dashboardController from "../controller/dashboard.controller";
import authMiddleware from "../middleware/auth.middleware";
const router = express.Router();

router.get(
  "/stats",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  dashboardController.getStats
);

export default router;
