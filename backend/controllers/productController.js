import Product from '../models/Product.js';
import Review from '../models/Review.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    // Mongoose virtuals are applied on toJSON, sending directly will include calculatedPrice
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      images: [],
      category: 'Sample category',
      stock: 0,
      description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      images,
      category,
      stock,
      discountPercent,
      saleStartsAt,
      saleEndsAt,
      isNewArrival,
      isFlashSale,
      fabric,
      color,
      sizes,
      isPreOrder
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name ?? product.name;
      product.price = price ?? product.price;
      product.description = description ?? product.description;
      product.images = images ?? product.images;
      product.category = category ?? product.category;
      product.stock = stock ?? product.stock;
      product.discountPercent = discountPercent ?? product.discountPercent;
      product.saleStartsAt = saleStartsAt ?? product.saleStartsAt;
      product.saleEndsAt = saleEndsAt ?? product.saleEndsAt;
      product.isNewArrival = isNewArrival ?? product.isNewArrival;
      product.isFlashSale = isFlashSale ?? product.isFlashSale;
      product.fabric = fabric ?? product.fabric;
      product.color = color ?? product.color;
      product.sizes = sizes ?? product.sizes;
      product.isPreOrder = isPreOrder ?? product.isPreOrder;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Public (Guest allowed based on prompt, but usually Private)
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, customerName } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Create Review
      const review = new Review({
        customerName: req.user ? req.user.name : customerName,
        rating: Number(rating),
        comment,
        product: product._id,
        user: req.user ? req.user._id : null,
      });

      await review.save();

      res.status(201).json({ message: 'Review added and pending approval' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Admin approve review
// @route   PUT /api/products/reviews/:reviewId/approve
// @access  Private/Admin
const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (review) {
      review.isApproved = true;
      await review.save();

      // Update product rating
      const approvedReviews = await Review.find({ product: review.product, isApproved: true });
      const product = await Product.findById(review.product);
      
      product.reviewCount = approvedReviews.length;
      product.averageRating =
        approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length;

      await product.save();

      res.json({ message: 'Review approved' });
    } else {
      res.status(404);
      throw new Error('Review not found');
    }
  } catch (error) {
    next(error);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  approveReview,
};
