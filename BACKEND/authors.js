import express from "express";
import { add, addAvatar, edit, get, getAll, remove } from "./controllers/authors.js";
import uploadCloudinary from "./middlewares/uploadCloudinary.js";

const authorsRouter = express.Router(); //router vuoto
authorsRouter.get('/', getAll);
authorsRouter.post('/', add);
authorsRouter.get('/:id', get);
authorsRouter.put('/:id', edit); 
authorsRouter.patch('/:id/avatar', uploadCloudinary.single('avatar'), addAvatar); 
authorsRouter.delete('/:id', remove); 
export default authorsRouter;