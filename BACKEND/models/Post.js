import mongoose, {Schema} from "mongoose";

const PostScheme = new Schema({
  category: {type: String, required: true},
  title: {type: String, required: true}, 
  cover: {type: String, default: 'https://res.cloudinary.com/dm9gnud6j/image/upload/v1757097390/noimg_tl6gzb.jpg'},
  readTime: {
    value: Number,
    unit: String,
  },
  author: {type: String, required: true},
  content: {type: String, required: true}
}, {timestamps: true}); 

const Post = mongoose.model('Post', PostScheme); 

export default Post; 