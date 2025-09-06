import mongoose from "mongoose";
import Post from "../models/Post.js";
import sanitizeHtml from '../sanitize.js'; 

/*
 * recupera tutti i post
 */
export async function getAll(request, response){
  try{
    const posts = await Post.find(); 
    response.status(200).json(posts);
  } catch (err) {
    response
      .status(500)
      .json({ message: "errore nel recupero dei post", err });
  }
}

/*
 * recupera un singolo post
 */
export async function get(request, response) {
  try{
    const {id} = request.params; 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "ID non valido" });
    }
    const post = await Post.findById(id); 
  
    if (!post)
      return response.status(404).json({ message: "post non trovato" });
  
    response.status(200).json(post);
  } catch (err) {
    response
      .status(500)
      .json({ message: "errore nel recupero del singolo post", err });
  }
}

/*
 * aggiunge un post
 */
export async function add(request, response) {
  try {
    const {category, title, cover, readTime, author, content} = request.body; 

    const cleanContent = sanitizeHtml(content);
  
    const newPost = new Post({
      category,
      title,
      cover,
      readTime,
      author, 
      content: cleanContent
    }); 
  
    const savedPost = await newPost.save(); 
    response.status(201).json(savedPost);

  } catch(err){
    response
      .status(500)
      .json({ message: "errore nella creazione del post", err });
  }
}

/*
 * modifica un post
 */
export async function edit(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "ID non valido" });
    }

    const {category, title, cover, readTime, author, content} = request.body; 
 
    const cleanContent = sanitizeHtml(content);
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {category, title, cover, readTime, author, content: cleanContent },
      {new:true} 
    );
    if (!updatedPost) {
      return response
      .status(400)
      .json({ message: "Post non trovato", error });
    }
    response.status(200).json(updatedPost);
  } catch (error) {
    response
    .status(500)
    .json({ message: "errore nella modifica del post", error });  
  }
}

/* 
 * elimina un post
*/
export async function remove(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "ID non valido" });
    }
    const toRemove = await Post.findByIdAndDelete(id); 
    if(!toRemove) {
      return response.status(404).json({ message: "post non trovato" });
    }
    response.status(200).json(toRemove); 
  } catch(error) {
    response.status(500).json({ message: "errore nell'eliminazione del post", error });
  }
}

/*
  aggiunta foto
 */
export async function addCover(request, response) {
  try{
    let filePath = request.file?.path;
    if(!filePath)
      filePath = 'https://res.cloudinary.com/dm9gnud6j/image/upload/v1757097390/noimg_tl6gzb.jpg'; 
    const {id} = request.params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "ID non valido" });
    }

    const post = await Post.findByIdAndUpdate(id, {cover: filePath}, {new: true}); 
    if(!post) {
      return response.status(404).json({ message: "post non trovato" });
    }

    response.status(200).json(post); 

  }catch(err){
    response.status(500).json({ message: "errore nell'aggiunta della foto al post", err });
  }
}