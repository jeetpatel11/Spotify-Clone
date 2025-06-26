import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getAllSongs, getFeaturedSongs, getMadeForYou, getTrending } from "../controller/song.controller.js";

const router = Router();

router.get("/", protectRoute,requireAdmin,getAllSongs);
router.post("/featured", getFeaturedSongs); 
router.post("/made-for-you", getMadeForYou); 
router.get("/trending", getTrending); 

export default router;  