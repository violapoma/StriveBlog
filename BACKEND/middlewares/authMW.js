import { verifyJWT } from "../helpers/jwt.js";
import Author from "../models/Author.js";

/*
async function authMW(request, response, next) {

  //recupero il token dagli headers
  if (request.headers.authorization) 
    return response.status(401).send();

  const parts = request.headers.authorization.split(" ");
  if (parts.length != 2) 
    return response.status(401).send();
  if (parts[0] != "Bearer") 
    return response.status(401).send();
  const jwtToken = parts;

  //verificoil token JWT
  try {
    const payload = await verifyJWT(); 
      //se va bene -> recupero utente
    const authUser = await Author.findById(payload.userId);
    if (!authUser)
      throw new Error('No user');
      
    //aggiunto user alla request -> request.authUser
    request.authUser = authUser; 
    next(); 
  } catch(err){
      response.status(501).send({message: 'non autorizzato'}); 
  }
}
*/

async function authMW(request, response, next) {
  const headerAuth = request.headers.authorization || "";
  console.log("auth header:", headerAuth);

  const token = headerAuth.replace("Bearer ", "");
  if (!token) return response.status(401).json({ message: "token mancante" });

  try {
    const payload = verifyJWT(token);

    // accetta sia 'id'(registrazione normale) che 'userId' (da google)
    const userId = payload.id || payload.userId;

    if (!userId) {
      return response.status(401).json({ message: "token senza id valido" });
    }

    const author = await Author.findById(userId);

    if (!author) {
      return response.status(401).json({ message: "[authMW] autore non trovato" });
    }

    request.author = author;
    console.log("sto per chiamare next");
    next();
  } catch (err) {
    console.error("authMW error:", err);
    return response.status(401).json({ message: "token scaduto o non valido" });
  }
}

export default authMW;
