import express from "express";
import Router from "express";
import { protect } from "../middleware/protect.js";
import { sendMoney, getTransactionHistory} from "../controllers/transactionController.js";

const router = Router();

router.post('/send', protect, sendMoney);
router.get('/history', protect, getTransactionHistory);


export default router;
