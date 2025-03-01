import express from "express"
import { createPayment,paymentVerification } from "../controllers/payment.controller.js"

const router=express.Router()

router.post("/checkout",createPayment);
router.post("/verify-payment", paymentVerification);


export default router