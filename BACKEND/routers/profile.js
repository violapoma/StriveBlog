import express from "express";
import authMW from "../middlewares/authMW.js";
import { addAvatar, deleteMe, edit, getMe } from "../controllers/profile.js";
import {uploadAvatar} from "../middlewares/uploadCloudinary.js";

const profileRouter = express.Router();

profileRouter.get("/", authMW, getMe);
profileRouter.put("/edit", authMW, edit);
profileRouter.patch("/edit/avatar", authMW, uploadAvatar.single("avatar"), (err, req, res, next) => {
  console.error("Errore multer:", err);
  res.status(500).json({ error: err.message || "Upload error" });
},addAvatar);
profileRouter.delete("/", authMW, deleteMe);

export default profileRouter; 