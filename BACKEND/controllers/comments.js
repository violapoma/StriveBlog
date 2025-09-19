import mongoose from "mongoose";
import Post from "../models/Post.js";
import Author from "../models/Author.js";

//TODO: fai middlewqare per la validazione dell'id e del post

/* recupera tutti i commenti di un articolo */
export async function getAll(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return response.status(404).json({ message: "ID post non valido" });

    const post = await Post.findById(id);
    if (!post)
      return response.status(404).json({ message: "post non trovato" });

    response.status(200).json(post.comments);
  } catch (err) {
    response.status(500).json({
      message: `errore nel recupero dei commenti del post ${id}`,
      err,
    });
  }
}

/* prende un singolo commento */
export async function get(request, response) {
  try {
    const { id, cId } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return response.status(404).json({ message: "ID post non valido" });
    if (!mongoose.Types.ObjectId.isValid(cId))
      return response.status(404).json({ message: "ID commento non valido" });

    const post = await Post.findById(id);
    if (!post)
      return response.status(404).json({ message: "post non trovato" });

    const comment = post.comments.find(
      (comment) => comment._id.toString() === cId
    );
    if (!comment)
      return response.status(404).json({ message: "commento non trovato" });

    response.status(200).json(comment);
  } catch (err) {
    response.status(500).json({
      message: `errore nel recupero del commento ${id} del post ${cId}`,
      err,
    });
  }
}

/* crea un commento */
export async function add(request, response) {
  try {
    const { text, author } = request.body;
    if (!mongoose.Types.ObjectId.isValid(author))
      return response.status(404).json({ message: "ID autore non valido" });

    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return response.status(404).json({ message: "ID post non valido" });

    const authorDB = await Author.findById(author);
    if (!authorDB)
      return response.status(404).json({ message: "autore non esistente" });

    const post = await Post.findById(id);
    if (!post)
      return response.status(404).json({ message: "post non trovato" });

    const newComment = { text, author: request.author._id }; //timestamps presi in automatico, non serve prenderli a mano
    post.comments.push(newComment);
    await post.save();
    response.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    response.status(500).json({
      message: `errore nella creazione del commento `,
      err,
    });
  }
}

/* aggiorna un commento */
export async function edit(request, response) {
  try {
    const { text, author } = request.body;
    if (!mongoose.Types.ObjectId.isValid(author))
      return response.status(404).json({ message: "ID autore non valido" });

    const { id, cId } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return response.status(404).json({ message: "ID post non valido" });
    if (!mongoose.Types.ObjectId.isValid(cId))
      return response.status(404).json({ message: "ID commento non valido" });

    const authorDB = await Author.findById(author);
    if (!authorDB)
      return response.status(404).json({ message: "autore non esistente" });

    const post = await Post.findById(id);
    if (!post)
      return response.status(404).json({ message: "post non trovato" });

    let comment = post.comments.find(
      (comment) => comment._id.toString() === cId
    );
    if (!comment)
      return response.status(404).json({ message: "commento non trovato" });
    comment.text = text;
    await post.save();

    response.status(200).json(comment);
  } catch (err) {
    response.status(500).json({
      message: `errore nella modifica del commento `,
      err,
    });
  }
}

/* cancella un commento */
export async function remove(request, response) {
  try {
    const { id, cId } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return response.status(404).json({ message: "ID post non valido" });
    if (!mongoose.Types.ObjectId.isValid(cId))
      return response.status(404).json({ message: "ID commento non valido" });

    const post = await Post.findById(id);
    if (!post)
      return response.status(404).json({ message: "post non trovato" });

    let comment = post.comments.find(
      (comment) => comment._id.toString() === cId
    );
    if (!comment)
      return response.status(404).json({ message: "commento non trovato" });

    post.comments = post.comments.filter((comment) => comment._id.toString() !== cId);
    await post.save();

    response.status(200).json(comment);
  } catch (err) {
    response.status(500).json({
      message: `errore nella creazione del commento al post ${id}`,
      err,
    });
  }
}
