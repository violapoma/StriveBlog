import axios from "axios";

const axiosInstance = axios.create({
  baseURL : import.meta.env.VITE_BACKEND_HOST,
  headers : {
    'Content-Type' : 'application/json',
  }
})


export default axiosInstance; 