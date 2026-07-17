import { Router } from "express";
import passport from "passport";
import { signup , login, getCurrentUser} from "../controllers/userControllers.js";

const router = Router();

router
.route("/signup")
.post(signup);

router
.route("/login")
.post(
    passport.authenticate("local"),
    login
);
router
.route("/add_to_activity");

router
.route("/get_all_activity");

router
.route("/current")
.get(getCurrentUser)


export default router;
