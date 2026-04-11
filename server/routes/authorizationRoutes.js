import express from "express";
import { handleLogout } from "../controllers/authorizationControllers.js";

export const authorizationRoute = express.Router();

authorizationRoute.get("/logout", handleLogout);