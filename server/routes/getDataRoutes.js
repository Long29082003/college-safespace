import express from "express";
import { handleGetPosts, handleGetRandomPosts } from "../controllers/getControllers.js";

export const getDataRoute = express.Router();

getDataRoute.get("/post", handleGetPosts);
getDataRoute.get("/random_post", handleGetRandomPosts);