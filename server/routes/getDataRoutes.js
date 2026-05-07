import express from "express";
import { handleGetPosts, handleGetRandomPosts, handleGetComments, handleGetReactions, handleGetPostWithReactions } from "../controllers/getControllers.js";

export const getDataRoute = express.Router();

getDataRoute.get("/post", handleGetPosts);

getDataRoute.get("/random_post", handleGetRandomPosts);

getDataRoute.get("/comment", handleGetComments);

getDataRoute.get("/reaction", handleGetReactions);

getDataRoute.get("/postwithreactions", handleGetPostWithReactions)