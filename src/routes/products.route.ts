import express from 'express';
import { protect } from '../controllers/auth.controller.js';
import {
  deleteProduct,
  getPricing,
  getProducts,
  updateProduct
} from '../controllers/products.controller.js';

const router = express.Router();

router.route('/products').get(getProducts);
router.route('/pricing').get(getPricing);
router.route('/products/:id').delete(protect, deleteProduct).patch(protect, updateProduct);

export default router;
