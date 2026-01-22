import express from "express";
import { handlePostSubmit, handleCommentSubmit, handleSubmitReaction } from "../controllers/submitControllers.js";

export const submitRoute = express.Router();

submitRoute.post("/post", handlePostSubmit);
submitRoute.post("/comment", handleCommentSubmit);
submitRoute.post("/reaction", handleSubmitReaction);