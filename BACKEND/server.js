import cors from "cors"; //altrimenti backend e frontend non comunicano essendo su porte diverse
import express from "express"; //ambiente
import "dotenv/config"; //importa il contenuto del file .env
// import authorRouter from './routers/author.router.js';
import { connectDB } from "./db.js";
import authorsRouter from "./routers/authors.js";
import postsRouter from "./routers/posts.js";
import morgan from "morgan";
import commentsRouter from "./routers/comments.js";
import authRouter from "./routers/auth.js";
import profileRouter from "./routers/profile.js";
import passport from "passport";
import googleStrategy from "./config/passportConfig.js";

const server = express(); //server di base, che va personalizzato

const port = process.env.PORT; //da file .env
//Server.use(midA); //mw globale
server.use(cors()); //middleware; va messo più in alto possibile altrimenti da errore
server.use(morgan("tiny")); //verbo indirizzo res.status peso - tempo_impiegato
server.use(express.json()); //per il parse; middleware

passport.use(googleStrategy); 

//server.use(middErr1); //catch errori vari
//server.use('/authors', [midA, midB], authorsRouter); //mw propri della rotta authors
// server.use('/api/v1/authors', authorRouter); //usa il router per author
server.use("/auth", authRouter);
server.use('/me', profileRouter); 
server.use("/authors", authorsRouter); //mw
server.use("/posts", postsRouter); //mw ; tutti in ordine di esecuzione
server.use("/posts", commentsRouter);

connectDB();
server.listen(port, () => console.log(`server avviato sulla porta ${port}`)); //sta sempre in ascolto
