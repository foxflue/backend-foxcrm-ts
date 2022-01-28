import { Router } from "express";
import organizationController from "../controller/organization.controller";
import authMiddleware from "./../middleware/auth.middleware";

const router = Router();

router.post(
  "/org-create",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  organizationController.store
);
router.post(
  "/org-email-verify/:token",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  organizationController.orgEmailVerify
);

router.get(
  "/org-index",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  organizationController.index
);

router.get(
  "/org-show/:id",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  organizationController.show
);

router.patch(
  "/org-update/:id",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  organizationController.update
);

router.delete(
  "/org-destroy/:id",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  organizationController.destroy
);

export default router;
