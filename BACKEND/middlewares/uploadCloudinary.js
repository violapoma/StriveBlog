import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

//per salvare l'immagine su cloudinary, ancora non salviamo su DB 
const storageCloudinary = new CloudinaryStorage({
  cloudinary, 
  params: {
    folder: 'StriveBlog',
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDIANRY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
});

const uploadCloudinary = multer({storage: storageCloudinary}); 

export default uploadCloudinary; 