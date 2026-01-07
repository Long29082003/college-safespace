import express from "express";
import { handlePostSubmit } from "../controllers/submitControllers.js";

export const submitRoute = express.Router();

submitRoute.post("/post", handlePostSubmit);