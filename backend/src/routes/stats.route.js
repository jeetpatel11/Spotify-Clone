import { Router } from "express";
import Song from "../models/song.model.js";
import User from "../models/user.model.js";
import Album from "../models/album.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getState } from "../controller/state.controller.js";

const router = Router();


router.get("/",protectRoute,getState);



export default router;