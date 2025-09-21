import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Author from "../models/Author.js";
import { signJWT } from "../helpers/jwt.js";
/*
export async function register(request, response) {
  const body = request.body;

  const user = await Author.findOne({ email: body.email.toLowerCase() });

  //installa http errors e fai return response.next(createHTTPError('conflict)) o simile
  if (user)
    return response
      .status(409)
      .json({ message: "conflitto: email già esistente" });

  //hash pw; su schema metti selected: false così non la manda se non la richiedi
  const hash = await bcrypt.hash(body.password, 10); //10: numero di round da fare

  const insertedUser = Author.create({ ...body, password: hash });

  response.send({ message: "success" });

  //mail di benvenuto ; await mailer.sendMail
}
*/

export async function register(request, response) {
  const { nome, cognome, email, password, dataDiNascita } = request.body;

  const existing = await Author.findOne({ email });
  if (existing) return response.status(400).json({ message: "Email già registrata" });

  const newAuthor = new Author({ nome, cognome, email, password, dataDiNascita });
  await newAuthor.save();

  const token = await signJWT({ id: newAuthor._id });
  try {
    const html = `
      <h1>Hi, ${nome} ${cognome}, <b>WELCOME ON BOARD!</b></h1>
      <h2>Our guidelines</h2>
      <p>Please, remember to post only appropriate content. What's inappropriate contet you ask? Well, you shouldn't. That being said, we hope to have a nice time together 🥰</p>
      <h2>When will you recive an email from us?</h2>
      <ul>
        <li>When you post a new article</li>
        <li>When a fellow author comments your article</li>
      </ul>
      <br>
      <p>→<a href='${process.env.FRONTEND_HOST}/authors/${newAuthor._id}'>CLICK HERE</a>← to visit your profile</p>
    `;
    
    const infoMail = await mailer.sendMail({
      to: email, 
      subject: "Thanks for joining us!",
      html: html,
      from: "violapoma@gmail.com", 
    });

    console.log("Mail sent. MessageId:", infoMail.messageId);
    console.log("SMTP response:", infoMail.response);
  } catch (mailErr) {
    console.error("Errore invio email commento:", mailErr);
  }

  return response.status(201).json({ jwt: token });
}

/* qui hash password, nella prossima login abbiamo già hashato la pw nel modello
export async function login(request, response) {
  const body = request.body; 

  //+ -> aggiunge al resto della risposta
  const user = await Author.findOne({email: body.email.toLowerCase()}).select('+password'); 

  if (!user)
    return response.status(401).json({ message: "credenziali sbagliate" });

  //compare guarda anche al salt
  if (!await bcrypt.compare(body.password, user.password))
    return response.status(401).json({ message: "credenziali sbagliate" }); 

  const token = generateJWT({userId: user._id});  
  //token obbligatorio, verrà usato in tutte le richieste future --header (fino al logout, poi cambia)
  response.send({token}); 
    
  //mail di benvenuto ; await mailer.sendMail
}

*/
export async function login(request, response) {
  const { email, password } = request.body;

  const userMail = await Author.findOne({ email }).select("+password");  console.log('utente', userMail);

  if (userMail) {
    //non nello stesso if perché se usermail è undefined poi comparepassword non fa
    if (await userMail.comparePassword(password)) {
      const jwt = await signJWT({
        id: userMail._id,
      });
      return response.status(200).json({message: 'token generato con successo', jwt}); 
    }
  }

  return response.status(400).json({ message: "credenziali sbagliate" });
}


export async function redirectToMe(request, response, next) {
  response.redirect(`${process.env.FRONTEND_HOST}/auth/google-callback?jwt=${request.user.jwt}`); //messo da me in request.user.jwt
}
