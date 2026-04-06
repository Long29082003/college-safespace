import express from "express";
import { handleUserRegistration, handleUserLogin, handleRefreshToken } from "../controllers/authControllers.js";

export const authRoute = express.Router();

authRoute.post("/register", handleUserRegistration);

authRoute.post("/login", handleUserLogin);

authRoute.get("/refresh", handleRefreshToken);