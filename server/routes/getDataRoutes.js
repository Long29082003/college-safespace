import express from "express";
import { handleGetPosts } from "../controllers/getControllers.js";

export const getDataRoute = express.Router();

getDataRoute.get("/post", handleGetPosts);