import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import {
  getUser,
  loginUser,
  logout,
  registerUser,
} from "../controllers/user.controller";

const router = Router();

router.route("/me").get(isLoggedIn, getUser);

router.route("/signup").post(registerUser);

router.route("/signin").post(loginUser);

router.route("/signout").get(logout);

export default router;
