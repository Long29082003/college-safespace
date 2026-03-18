import express from "express";
import { handleUserRegistration, handleUserLogin } from "../controllers/authControllers.js";

export const authRoute = express.Router();

authRoute.post("/register", handleUserRegistration);

authRoute.post("/login", handleUserLogin);