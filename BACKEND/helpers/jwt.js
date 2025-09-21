import jwt from "jsonwebtoken";
import "dotenv/config";

export async function signJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
}

//da mettere in tutte le rotte che non siano la login
export function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/*
export function generateJWT(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload, //passato alla funzione
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRESIN}, //più comodo per sviluppo != produzione
      (err, token) => {
        if (err) reject(err); //se c'è err, token è null
        if (token) resolve(token);
      }
    )
  })
}

export function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token, //passato alla funzione
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) reject(err); //se c'è err, token è null
        else resolve(decoded);
      }
    )
  })
}
*/
