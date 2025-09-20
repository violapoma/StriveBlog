import { Schema } from "mongoose";

const CommentScheme = new Schema({
  text: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'Author'}
}, {timestamps: true})


export default CommentScheme; //embedding -> no .model => esiste solo per articolo, no collection