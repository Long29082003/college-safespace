import express from "express";
import { handleUserRegistration } from "../controllers/authControllers.js";

export const authRoute = express.Router();

authRoute.post("/register", handleUserRegistration);