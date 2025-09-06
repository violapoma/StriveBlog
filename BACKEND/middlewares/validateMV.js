import Post from "../models/Post.js";

async function validatePost(request, response, next) {
  const { id } = request.params;
  const {category, title, readTime, author, content} = request.body; 
  if(!category || !title || !readTime || !author || !content) {
    return response
        .status(400)
        .json({ message: "manca un campo obbligatorio" });
  }
  const filter = {$and: [{title}]}; 

  if (id){//se è valorizzato -> sono nella PUT
    filter.$and.push({_id: {$ne: id}}) //$and proprietà di filter, è un array quindi .push  -> titolo uguale e id diverso
  } 

  //questa parte mi serve solo per la POST, per la PUT devo escludere dai post quello con l'id
  const posts = await Post.find(filter); //tutti i post con lo stesso titolo
  if (posts.length > 0)
    return response.status(400).json({message: 'questo titolo è già presente nel blog'}); 
  next(); 
}
export default validatePost; 