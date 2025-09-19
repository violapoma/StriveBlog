import express from "express";
import { add, addCover, edit, get, getAll, remove } from "./controllers/posts.js";
import validatePost from "./middlewares/validateMV.js";
import {uploadCover} from "./middlewares/uploadCloudinary.js";
import authMW from "./middlewares/authMW.js";


const postsRouter = express.Router(); 
postsRouter.get('/', getAll);
postsRouter.post('/', authMW, validatePost, add);
//postsRouter.get('/search', miaFun); 
postsRouter.get('/:id', get);
postsRouter.put('/:id', authMW, validatePost, edit); 
postsRouter.patch('/:id/cover', authMW, uploadCover.single('cover'), addCover); //cover nome campo da passare

postsRouter.delete('/:id', authMW, remove); 

export default postsRouter;