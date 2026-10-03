import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  approveReview,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(createProductReview); // Guest can review based on prompt logic

// Note: To support optional authentication for reviews, the route could use a modified protect middleware 
// that doesn't throw if no token is found, or we rely on the controller checking req.user. 
// For now, it's public, and controller checks req.user safely if we inject a soft auth middleware if needed.

router.route('/reviews/:reviewId/approve').put(protect, admin, approveReview);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
