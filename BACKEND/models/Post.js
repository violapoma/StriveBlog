import mongoose, {Schema} from "mongoose";
import CommentScheme from "./Comment.js";

const PostScheme = new Schema({
  category: {type: String, required: true},
  title: {type: String, required: true}, 
  cover: {type: String, default: 'https://res.cloudinary.com/dm9gnud6j/image/upload/v1757097390/noimg_tl6gzb.jpg'},
  readTime: {
    value: {
      type: Number,
      validator: Number.isInteger, //HO AGGIUNTO QUESTO
    },
    unit: String,
  },
  author: {type: Schema.Types.ObjectId, ref: 'Author'}, //ref
  content: {type: String, required: true},
  comments: [CommentScheme] //embedding 
}, {timestamps: true}); 


// Virtual field per contare i commenti -> ordine di popolarità
PostScheme.virtual("commentsCount").get(function () {
  return this.comments.length;
});


PostScheme.set("toJSON", { virtuals: true });
PostScheme.set("toObject", { virtuals: true });

const Post = mongoose.model('Post', PostScheme); 

export default Post; 