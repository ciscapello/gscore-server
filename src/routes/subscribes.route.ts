import express from 'express';
import { protect } from '../controllers/auth.controller.js';
import { getPricing, getProducts } from '../controllers/products.controller.js';
import { buyProduct, getSubscribes } from '../controllers/subscribes.controller.js';

const router = express.Router();

router.route('/payments/buy').post(protect, buyProduct);
router.route('/subscribe/self').get(protect, getSubscribes);
// router.route('/pricing').get(getPricing);

export default router;
