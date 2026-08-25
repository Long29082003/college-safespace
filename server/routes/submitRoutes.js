import express from "express";
import { handlePostSubmit, handleCommentSubmit, handleSubmitReaction, handleSubmitCampfireMessage } from "../controllers/submitControllers.js";

export const submitRoute = express.Router();

submitRoute.post("/post", handlePostSubmit);

submitRoute.post("/comment", handleCommentSubmit);

submitRoute.post("/reaction", handleSubmitReaction);

submitRoute.post("/campfiremsg", handleSubmitCampfireMessage);