import express, { request, response }  from "express";
import { add, addCover, edit, get, getAll, remove } from "./controllers/posts.js";
import validatePost from "./middlewares/validateMV.js";
import uploadCloudinary from "./middlewares/uploadCloudinary.js";


const postsRouter = express.Router(); 
postsRouter.get('/', getAll);
//patrick si ma?
postsRouter.post('/', validatePost, add);
//postsRouter.get('/search', miaFun); 
postsRouter.get('/:id', get);
//fabio nope
postsRouter.put('/:id', validatePost, edit); 
postsRouter.patch('/:id/cover', uploadCloudinary.single('cover'), addCover); //cover nome campo da passare
//viola nope
postsRouter.delete('/:id', remove); 

export default postsRouter;