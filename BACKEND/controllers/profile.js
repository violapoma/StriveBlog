import Author from "../models/Author.js";
import Post from "../models/Post.js";

export async function getMe(request, response) {
  try {
    console.log("REQUEST.AUTHOR", request.author);
    const author = request.author; //da mw

    return response.status(200).json(author);
  } catch (err) {
    console.error("Errore nel recupero dell'utente loggato", err);
    return response.status(500).json({ message: "Errore nel recupero utente loggato" });
  }
}

export async function addAvatar(req, res) {
  console.log('sono dentro ad addAvatar');
  console.log("req.file:", req.file);
  console.log("req.author:", req.author);
  try {
    console.log("File ricevuto:", req.file);
    console.log("Autore loggato:", req.author._id);

    if (!req.file) {
      return res.status(400).json({ message: "Nessun file caricato" });
    }
    
    const imgPath =
      req.file?.path ||
      "https://res.cloudinary.com/dm9gnud6j/image/upload/v1757176661/nopicuser_puf2bd.png";

    const updatedAuthor = await Author.findByIdAndUpdate(
      req.author._id,
      { avatar: imgPath },
      { new: true }
    );

    if (!updatedAuthor)
      return res.status(404).json({ message: "[addAvatar]:autore non trovato" });

    res.status(200).json(updatedAuthor);
  } catch (err) {
    console.error(
      "Errore caricando avatar:",
      JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
    );
    res.status(500).json({ message: "errore caricando avatar", err });
  }
}

export async function edit(request, response) {
  try {
    const id = request.author.id;
    console.log("id autore da modificare", id);
    const { nome, cognome, email, dataDiNascita, avatar } = request.body;
    console.log(nome, cognome, email, dataDiNascita, avatar);
    if (!nome || !cognome || !email || !dataDiNascita) {
      return response
        .status(400)
        .json({ message: "manca un campo obbligatorio" });
    }
    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      { nome, cognome, email, dataDiNascita, avatar },
      { new: true } //legge, aggiorna e da i dati nuovi, altrimenti ti da i dati vecchi
    );
    if (!updatedAuthor) {
      console.log("[edit]autore non trovato");
      return response
        .status(400)
        .json({ message: "utente non trovato", error });
    }
    console.log("autore trovato");
    response.status(200).json(updatedAuthor);
  } catch (error) {
    response
      .status(500)
      .json({ message: "errore nella modifica dell'autore", error });
  }
}

export async function deleteMe(req, res) {
  try {
    const id = req.author._id;

    //elimino i commenti -embedded -> pull da array
    await Post.updateMany(
      { "comments.author": id }, 
      { $pull: { comments: { author: id } } }
    );

    //elimino i miei post
    try{
      await Post.deleteMany({ author: id });
    } catch(error){
      res.status(500).json({ message: "Errore durante la cancellazione, Post.deleteMany", error });
    }

    // mi elimino x.x
    try{
      await Author.findByIdAndDelete(id);
    } catch(error){
      res.status(500).json({ message: "Errore durante la cancellazione, Author.findanddelete", error });
    }

    res.status(200).json({ message: "Autore e contenuti associati eliminati" });
  } catch (error) {
    res.status(500).json({ message: "Errore durante la cancellazione", error });
  }
}

/*
 *  elimina tutti i post di un autore (quando l'autore si cancella) 
 */
export async function removeAllPosts(request, response) {
  try {
    const { id } = request.params; // id autore

    const author = await Author.findById(id);
    if (!author) {
      return response.status(404).json({ message: "autore non trovato" });
    }

    const result = await Post.deleteMany({ author: id });

    response.status(200).json({
      message: `Eliminati ${result.deletedCount} post dell'autore`,
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "errore nell'eliminazione dei post", error });
  }
}

/*
 *  rimuove tutti i commenti dell'autore 
 */

export async function removeAllComments(request,response){
  try {
    const { id } = request.params; // id autore

    const author = await Author.findById(id);
    if (!author) {
      return response.status(404).json({ message: "autore non trovato" });
    }

    const result = await Post.deleteMany({ author: id });

    response.status(200).json({
      message: `Eliminati ${result.deletedCount} post dell'autore`,
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "errore nell'eliminazione dei post", error });
  }
}
