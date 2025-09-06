//file con le funzioni per author.js
import mongoose from "mongoose";
import Author from "../models/Author.js";

export async function getAll(request, response) {
  try {
    const authors = await Author.find();
    response.status(200).json(authors);
  } catch (error) {
    //di solito qui gli errori 500, quelli non gestiti
    response
      .status(500)
      .json({ message: "errore nel recupero degli autori", error });
  }
}

export async function get(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "ID non valido" });
    }
    const author = await Author.findById(id);
    if (!author)
      return response.status(404).json({ message: "autore non trovato" });
    if (author.avatar === '')
      author.avatar = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';
    response.status(200).json(author);
  } catch (error) {
    response
      .status(500)
      .json({ message: "errore nel recupero del singolo autore", error });
  }
}

export async function add(request, response) {
  try {
    //response.status(200).json(request.body);
    //const newAuthor = Author(request.body);

    // const newAuthor = Author({
    //   nome: request.body.nome,
    //   cognome: request.body.cognome,
    //   email: request.body.email,
    //   dataDiNascita: request.body.dataDiNascita,
    //   avatar: request.body.dataDiNascita,
    // })

    //creo nuovo modello di mongoose
    const { nome, cognome, email, dataDiNascita, avatar } = request.body;
    if (!nome || !cognome || !email || !dataDiNascita) {
      return response
        .status(400)
        .json({ message: "manca un campo obbligatorio" });
    }
    const newAuthor = new Author({
      nome,
      cognome,
      email,
      dataDiNascita,
      avatar,
    });

    //salvataggio su db; save funzione preesistente
    const savedAuthor = await newAuthor.save();
    response.status(201).json(newAuthor);
  } catch (error) {
    if (error.code === 11000) {
      //codice di mongo se la mail è già presente
      return response
        .status(400)
        .json({ message: "email già esistente", error });
    }
    response
      .status(500)
      .json({ message: "errore nella creazione dell'autore", error });
  }
}

export async function addAvatar(request, response){
  try{
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "ID non valido" });
    }

    const imgPath = request.file.path; 
    
    const author = await Author.findByIdAndUpdate(id, {avatar: imgPath}, {new: true}); 
    if(!author) {
      return response
      .status(400)
      .json({ message: "utente non trovato", error });
    }
    response.status(200).json(author);
  } catch(err){
    response
    .status(500)
    .json({ message: "errore nella modifica dell'immagine dell'autore", err });  
  }
}

export async function edit(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "ID non valido" });
    }

    const { nome, cognome, email, dataDiNascita, avatar } = request.body;
    if (!nome || !cognome || !email || !dataDiNascita) {
      return response
        .status(400)
        .json({ message: "manca un campo obbligatorio" });
    }
    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      { nome, cognome, email, dataDiNascita, avatar },
      {new:true} //legge, aggiorna e da i dati nuovi, altrimenti ti da i dati vecchi
    );
    if (!updatedAuthor) {
      return response
      .status(400)
      .json({ message: "utente non trovato", error });
    }
    response.status(200).json(updatedAuthor);
  } catch (error) {
    response
    .status(500)
    .json({ message: "errore nella modifica dell'autore", error });  
  }
}


export async function remove(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "ID non valido" });
    }
    const toRemove = await Author.findByIdAndDelete(id); 
    if(!toRemove) {
      return response.status(404).json({ message: "autore non trovato" });
    }
    response.status(200).json(toRemove); 
  } catch(error) {
    response.status(500).json({ message: "errore nell'eliminazione dell'autore", error });

  }
}