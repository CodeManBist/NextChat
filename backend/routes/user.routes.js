import express from "express";
import { getAllUsers, registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;


