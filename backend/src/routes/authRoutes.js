import express from "express"
import { Router } from "express"
import { registerUser, loginUser, setUpMpin, getUserProfile} from "../controllers/authController.js";
import { protect } from "../middleware/protect.js";


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/set-mpin', protect,setUpMpin);
router.get('/profile',protect, getUserProfile);

export default router;