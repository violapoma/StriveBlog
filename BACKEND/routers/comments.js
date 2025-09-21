import express from "express";
import { add, edit, get, getAll, remove } from "../controllers/comments.js";
import authMW from "../middlewares/authMW.js";

const commentsRouter = express.Router(); 

commentsRouter.get('/:id/comments', getAll);
commentsRouter.get('/:id/comments/:cId', get); 
commentsRouter.post('/:id/comments', authMW, add);
commentsRouter.put('/:id/comments/:cId', authMW, edit); 
commentsRouter.delete('/:id/comments/:cId',authMW, remove); 

export default commentsRouter; 