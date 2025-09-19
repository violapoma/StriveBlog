import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { signJWT } from "../helpers/jwt.js";
import Author from "../models/Author.js";

const googleStrategy = new GoogleStrategy(
  //per tirare fuori il popUp di google
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_HOST}:${process.env.PORT}${process.env.GOOGLE_CALLBACK_PATH}`,
  },
  //callback che si attiva quando google ci passa i dati
  async function (accessToken, refreshToken, profile, cb) {
    console.log("callback google, profile", profile);
    //profile.id identificativo importante da salvare nel DB
    //profile._json altri dati del profilo pubblico
    try {
      //no findById perché non è l'id di mongo
      let user = await Author.findOne({ googleId: profile.id });
      if (!user) {
        //non trovato, è da creare
        user = await Author.create({
          nome: profile._json.given_name,
          cognome: profile._json.family_name,
          email: profile._json.email,
          avatar: profile._json.picture, //così però se la toglie abbiamo la pic broken
          googleId: profile.id,
        });
      }
      const jwt = await signJWT({userId: user.id}); //quello di Mongo ma senza il trattino

      cb(null, {jwt}) //tipo next, mi manda avanti; mi troverò la chiave jwt in reqest.user
    } catch (err) {
      cb(err, null) //tipo next, mi manda avanti; mi troverò la chiave jwt in reqest.user
    }
  }
);

export default googleStrategy; 
