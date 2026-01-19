import express from "express";
import { handlePostSubmit, handleCommentSubmit } from "../controllers/submitControllers.js";

export const submitRoute = express.Router();

submitRoute.post("/post", handlePostSubmit);
submitRoute.post("/comment", handleCommentSubmit);