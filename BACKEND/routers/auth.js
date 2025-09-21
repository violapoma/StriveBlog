import express from "express";
import { login, register, redirectToMe } from "../controllers/auth.js";
import passport from "passport";
import { registerFieldsMw } from "../middlewares/registerFieldsMw.js";

const authRouter = express.Router();

authRouter.post("/register", registerFieldsMw, register);
authRouter.post("/login", login);

authRouter.get(
  "/login-google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google-callback",
  passport.authenticate("google", {
    session: false,
  }), //false perché non stiamo usando i coockies
  redirectToMe
);

export default authRouter;
