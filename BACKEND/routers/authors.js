import express from "express";
import { get, getAll, getAuthorPosts, } from "../controllers/authors.js";

import { validateId } from "../middlewares/validateId.js";

const authorsRouter = express.Router(); //router vuoto
authorsRouter.get('/', getAll); 
authorsRouter.get('/:id', validateId ,get);
authorsRouter.get('/:id/posts', validateId, getAuthorPosts) ;
export default authorsRouter;