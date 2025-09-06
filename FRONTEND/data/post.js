import axios from "./axios.js";

export async function getAll(){
  try {

    const resp = await axios.get('./posts');
    return resp.data; 

  } catch(err) {
    console.log(err); 
  } 
}

export async function getPost(id){
  try {

    const resp = await axios.get(`./posts/${id}`);
    return resp.data; 

  } catch(err) {
    console.log(err); 
  } 
}

