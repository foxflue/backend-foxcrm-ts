import { Router } from "express";
import organizationController from "../controller/organization.controller";
import authMiddleware from "./../middleware/auth.middleware";

const router = Router();

router.post(
  "/org-create",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  organizationController.store
);

router.get(
  "/org-index",
  [authMiddleware.checkLogin, authMiddleware.checkSuperAdmin],
  organizationController.index
);

router.get(
  "/org-show",
  [authMiddleware.checkLogin],
  organizationController.show
);

router.patch(
  "/org-update",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  organizationController.update
);

router.delete(
  "/org-destroy/:id",
  [authMiddleware.checkLogin, authMiddleware.checkSuperAdmin],
  organizationController.destroy
);

export default router;
