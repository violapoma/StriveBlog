//crea lo schema

import mongoose, { Schema } from "mongoose"; //collection nel DB
import bcrypt from 'bcrypt'; 

const AuthorScheme = new Schema({
  nome: {type: String, required: true, trim: true}, //condizioni; se è una sola non serve passarla come oggetto
  cognome: {type: String, trim: true},
  email: {type: String, required: true, unique: true, trim: true},
  dataDiNascita: {type: String}, //meglio salvare string invece di Date //required
  avatar: {type: String, default: 'https://res.cloudinary.com/dm9gnud6j/image/upload/v1757176661/nopicuser_puf2bd.png'},
  password: {type: String, minlength: 6, select: false}, //required
  googleId: String
});

//cifratura della password da schema, invocata ogni volta che si sta per salvare un autore 
AuthorScheme.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); 
  }
  try{
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch(err){
    next(err);
  }
}); 

AuthorScheme.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) throw new Error("Password non salvata per questo utente");
  return await bcrypt.compare(candidatePassword, this.password);
};
//modello: struttura degli oggetti nel DB (es: autore, post, commento...) -> entità di base
//ogni modello ha uno schema 
const Author = mongoose.model('Author', AuthorScheme);

export default Author; 


  