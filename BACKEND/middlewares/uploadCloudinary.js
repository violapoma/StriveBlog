import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4 } from "uuid"; // genera UUID univoci



// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage per avatar autori
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "StriveBlog/avatars",
    format: "png",
    public_id: () => uuidv4(), 
  },
});

// Storage per cover post
const coverStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "StriveBlog/covers",
    format: "jpg",
    public_id: (req, file) => {
      const ext = file.originalname.split(".").pop();
      return `${uuidv4()}.${ext}`; // nome unico
    },
  },
});

// Middleware multer
export const uploadAvatar = multer({ storage: avatarStorage });
export const uploadCover = multer({ storage: coverStorage });