import express from "express";
import { add, addCover, edit, get, getAll, remove } from "../controllers/posts.js";
import validatePost from "../middlewares/validateMV.js";
import {uploadCover} from "../middlewares/uploadCloudinary.js";
import authMW from "../middlewares/authMW.js";
import { validateId } from "../middlewares/validateId.js";


const postsRouter = express.Router(); 
postsRouter.get('/', getAll);
postsRouter.post('/', authMW, validatePost, add);
//postsRouter.get('/search', miaFun); 
postsRouter.get('/:id', validateId, get);
postsRouter.put('/:id', authMW, validateId, validatePost, edit); 
postsRouter.patch('/:id/cover', authMW, validateId, uploadCover.single('cover'), addCover); //cover nome campo da passare

postsRouter.delete('/:id', authMW, validateId, remove); 

export default postsRouter;