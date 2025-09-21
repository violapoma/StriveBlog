import Post from "../models/Post.js";
import sanitizeHtml from "../sanitize.js";
import mailer from "../helpers/mailer.js";

/*
 * recupera 
 * tutti i post (e li manda in ordine di #commenti poi data) 
 * o i post(title) da cercare
 */
export async function getAll(request, response) {
  try {
    const { title } = request.query;
    let page = parseInt(request.query.page) || 1;
    if (page < 1) page = 1;

    const perPage = parseInt(request.query.perPage) || 3;
    if (perPage < 1 || perPage > 25) perPage = 3;

    const matchStage = {}; //stage della pipeline di aggregate

    if (title) {
      matchStage.title = { $regex: title, $options: "i" }; //filtro per titolo in caso
    }

    //conto il totale dei documenti che corrispondono al filtro
    const totalCount = await Post.countDocuments(matchStage);
    const totalPages = Math.ceil(totalCount / perPage);

    //aggregate metodo per eseguire pipeline di elaborazioni di dati, li sistema e manda quelli che servono
    const posts = await Post.aggregate([ 
      { $match: matchStage }, //filtra i documenti
      {
        $addFields: {
          commentsCount: { $size: "$comments" } //aggiungo #commenti; virtuale
        }
      },
      {
        $sort: { commentsCount: -1, createdAt: -1 } //ordino per #commenti poi data
      },
      { $skip: (page - 1) * perPage }, //indici di paginazione
      { $limit: perPage }, //limite per pagina
      {
        $lookup: { //aka populate -> join
          from: "authors",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },{
        $unwind: "$author" //autore è sempre uno, così non ritorna un array
      }
    ]);

    response.status(200).json({
      page,
      perPage,
      totalPages,
      totalCount,
      posts
    });
  } catch (err) {
    response.status(500).json({ message: "errore nel recupero dei post", err });
  }
}


/*
 * recupera un singolo post
 */
export async function get(request, response) {
  try {
    const { id } = request.params;
    const post = await Post.findById(id).populate("author");

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
    const { category, title, cover, readTime, content } = request.body;

    const cleanContent = sanitizeHtml(content);

    const newPost = new Post({
      category,
      title,
      cover,
      readTime,
      author: request.author._id, //referencing, utente loggato
      content: cleanContent,
    });

    const savedPost = await newPost.save();

    const html = `
    <p>Your post with title ${title} was created successfully. <a href='${process.env.FRONTEND_HOST}/posts/${newPost._id}'> Check it out!</a> </p>  `;

    const infoMail = await mailer.sendMail({
      to: request.author.email,
      subject: "New post created",
      html: html,
      from: "violapoma@gmail.com",
    });

    console.log("MessageId:", infoMail.messageId);
    console.log("SMTP response:", infoMail.response);

    response.status(201).json(savedPost);
  } catch (err) {
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
    const { id } = request.params; //id post

    const { category, title, cover, readTime, content } = request.body;

    const cleanContent = sanitizeHtml(content);
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { category, title, cover, readTime, content: cleanContent },
      { new: true }
    );
    if (!updatedPost) {
      return response.status(400).json({ message: "Post non trovato", error });
    }

    const html = `
    <h1>Edited successfully</h1>
    <p>Your post with title ${title} was updated successfully. <a href='${process.env.FRONTEND_HOST}/posts/${updatedPost._id}'> Check it out </a> </p>
  `;

    const infoMail = await mailer.sendMail({
      to: request.author.email,
      subject: "Edited successfully",
      html: html,
      from: "violapoma@gmail.com",
    });

    console.log("MessageId:", infoMail.messageId);
    console.log("SMTP response:", infoMail.response);
    response.status(200).json(updatedPost);
  } catch (error) {
    response
      .status(500)
      .json({ message: "errore nella modifica del post", error });
  }
}

/*
  aggiunta foto
 */
export async function addCover(request, response) {
  try {
    let filePath = request.file?.path;
    if (!filePath)
      filePath =
        "https://res.cloudinary.com/dm9gnud6j/image/upload/v1757097390/noimg_tl6gzb.jpg";
    const { id } = request.params;

    const post = await Post.findByIdAndUpdate(
      id,
      { cover: filePath },
      { new: true }
    );
    if (!post) {
      return response.status(404).json({ message: "post non trovato" });
    }

    response.status(200).json(post);
  } catch (err) {
    response
      .status(500)
      .json({ message: "errore nell'aggiunta della foto al post", err });
  }
}

/*
 * elimina un post
 */
export async function remove(request, response) {
  try {
    const { id } = request.params;
    const toRemove = await Post.findByIdAndDelete(id);
    if (!toRemove) {
      return response.status(404).json({ message: "post non trovato" });
    }
    response.status(200).json(toRemove);
  } catch (error) {
    response
      .status(500)
      .json({ message: "errore nell'eliminazione del post", error });
  }
}

