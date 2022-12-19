import express from 'express';
import { protect } from '../controllers/auth.controller.js';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct
} from '../controllers/products.controller.js';

const router = express.Router();

router.route('/products').get(getAllProducts).post(protect, createProduct);
router
  .route('/products/:id')
  .get(getProduct)
  .delete(protect, deleteProduct)
  .patch(protect, updateProduct);

export default router;
