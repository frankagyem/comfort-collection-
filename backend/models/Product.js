import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Admin who created the product
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      // e.g., 'Bathroom Towels', 'Bed Sheets', 'Door Curtains'
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discountPercent: {
      type: Number,
      required: true,
      default: 0,
    },
    saleStartsAt: {
      type: Date,
      default: null,
    },
    saleEndsAt: {
      type: Date,
      default: null,
    },
    images: [
      {
        type: String, // URLs to Supabase storage
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      required: true,
      default: 0,
    },
    reviewCount: {
      type: Number,
      required: true,
      default: 0,
    },
    // New fields based on prompt
    fabric: { type: String },
    color: { type: String },
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    isPreOrder: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property for calculated price (discount applied)
productSchema.virtual('calculatedPrice').get(function () {
  if (this.isFlashSale || this.discountPercent > 0) {
    const now = new Date();
    // Check if within sale window if dates are set
    if (this.saleStartsAt && this.saleEndsAt) {
      if (now >= this.saleStartsAt && now <= this.saleEndsAt) {
        return this.price - (this.price * this.discountPercent) / 100;
      }
    } else if (this.discountPercent > 0) {
      return this.price - (this.price * this.discountPercent) / 100;
    }
  }
  return this.price;
});

// Ensure virtuals are included in JSON/Object conversion
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
