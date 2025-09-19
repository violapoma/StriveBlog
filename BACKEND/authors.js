import express from "express";
import { get, getAll, } from "./controllers/authors.js";
import {uploadAvatar} from "./middlewares/uploadCloudinary.js";
import authMW from "./middlewares/authMW.js";
import { validateId } from "./middlewares/validateId.js";

const authorsRouter = express.Router(); //router vuoto
authorsRouter.get('/', getAll);
// authorsRouter.post('/', add);
//authorsRouter.get('/me', authMW ,getMe); 
authorsRouter.get('/:id', validateId ,get);
//authorsRouter.put('/:id',authMW, edit); 
//authorsRouter.patch('/:id/avatar', authMW, uploadAvatar.single('avatar'), addAvatar); 
//authorsRouter.delete('/:id', authMW, remove); 
export default authorsRouter;