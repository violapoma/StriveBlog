import express from "express";
import { add, edit, get, getAll, remove } from "../controllers/comments.js";
import authMW from "../middlewares/authMW.js";
import { validateId } from "../middlewares/validateId.js";

const commentsRouter = express.Router(); 

commentsRouter.get('/:id/comments', validateId, getAll);
commentsRouter.get('/:id/comments/:cId', validateId, get); 
commentsRouter.post('/:id/comments', authMW, validateId, add);
commentsRouter.put('/:id/comments/:cId', authMW, validateId, edit); 
commentsRouter.delete('/:id/comments/:cId',authMW, validateId, remove); 

export default commentsRouter; 