import mongoose from "mongoose";
import 'dotenv/config'; 

export async function connectDB(){
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI); 
    console.log('connessione db avvenuta con successo'); 
  } catch (error){
    console.log(error)
  }
}