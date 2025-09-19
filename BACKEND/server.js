import cors from "cors"; //altrimenti backend e frontend non comunicano essendo su porte diverse
import express from "express"; //ambiente
import "dotenv/config"; //importa il contenuto del file .env
// import authorRouter from './routers/author.router.js';
import { connectDB } from "./db.js";
import authorsRouter from "./authors.js";
import postsRouter from "./posts.js";
import morgan from "morgan";
import commentsRouter from "./comments.js";
import authRouter from "./auth.js";
import authMW from "./middlewares/authMW.js";
import profileRouter from "./profile.js";
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
server.use("/posts", authMW, commentsRouter);

connectDB();
server.listen(port, () => console.log(`server avviato sulla porta ${port}`)); //sta sempre in ascolto
