import { Router } from "express";
import organizationController from "../controller/organization.controller";
import { organizationSchema } from "../schema/organization.schema";
import authMiddleware from "./../middleware/auth.middleware";
import { validate } from "./../middleware/validate.middleware";

const router = Router();

router.post(
  "/org-create",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  validate(organizationSchema),
  organizationController.store
);
router.post(
  "/org-email-verify/:token",
  [authMiddleware.checkLogin, authMiddleware.checkAdmin],
  organizationController.orgEmailVerify
);

router.get(
  "/org-index",
  [authMiddleware.checkLogin, authMiddleware.checkSuperAdmin],
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
