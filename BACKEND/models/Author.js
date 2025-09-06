//crea lo schema

import mongoose, { Schema } from "mongoose"; //collection nel DB

const AuthorScheme = new Schema({
  nome: {type: String, required: true, trim: true}, //condizioni; se è una sola non serve passarla come oggetto
  cognome: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, trim: true},
  dataDiNascita: {type: String, required: true}, //meglio salvare string invece di Date
  avatar: {type: String, default: 'https://res.cloudinary.com/dm9gnud6j/image/upload/v1757097390/noimg_tl6gzb.jpg'}
});

//modello: struttura degli oggetti nel DB (es: autore, post, commento...) -> entità di base
//ogni modello ha uno schema 
const Author = mongoose.model('Author', AuthorScheme);

export default Author; 

/**
  import {model, Schema} from 'mongoose';

  const userSchema = new Schema({
    nome: {type: String, required: true, trim:true},
    cognome: {type: String, min:2, max:15, trim:true},
    email: {
      type: String, 
      match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'please fill with a valid email address'], //blocco
      trim:true, //pulizia dati
      lowercase:true,
      unique:true,
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    birthDate: {
      type: Date,
      min: '1900-01-01',
      max: Date.now, //senza parentesi così la esegue ogni volta
    },
    catsNumber: {
      type: Number,
      validate: {
        validator: Number.isInteger, //una qualsiasi funzione SENZA LE TONDE
        message: 'deve essere intero'
      },
    },
    eyeColor: {
      type: String, 
      enum: ['green', 'brown', 'blue'],
    },
    favSport: {
      type: [String], //array di stringhe, più di un valore
    },
    address: {
      type: {
        city: String,
        street: String,
        civic: {type: Number, validate: {validator: Number.isInteger}},
      }
    }
  });

  const User = model( //da mongoose
    'User',
    userScheme, 
    ['utenti']); //quest'ultima solo se non rispetti le convenzioni per chiamare le collection e i model

    export default User;
 */