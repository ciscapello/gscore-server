import express from 'express';
import { protect } from '../controllers/auth.controller.js';
import { getPricing, getProducts } from '../controllers/products.controller.js';

const router = express.Router();

router.route('/products').get(getProducts);
router.route('/pricing').get(getPricing);

export default router;
