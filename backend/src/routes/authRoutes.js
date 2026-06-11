import { Router } from "express";
import passport from "passport";
import { authController } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: encodeURIComponent(req.query.redirect || "/menu/impeccable-unisex-salon"),
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/menu/impeccable-unisex-salon?auth=failed`,
  }),
  authController.googleCallback,
);

router.get("/me", protect, authController.me);
router.post("/logout", authController.logout);

export default router;