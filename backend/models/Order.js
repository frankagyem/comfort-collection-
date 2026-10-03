import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  priceAtOrder: { type: Number, required: true },
  size: { type: String }, // Selected size
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Null if guest checkout
      default: null,
    },
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    deliveryLocation: {
      type: String,
      required: true, // e.g., 'GHANA', 'UK', 'NIGERIA', or other
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    orderItems: [orderItemSchema],
    deliveryFee: {
      type: Number,
      required: true,
      default: 0.0,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
      default: 'pending',
    },
    referralCode: {
      type: String, // Code of the referrer (if any)
      default: null,
    },
    paymentMethod: {
      type: String,
      default: 'WhatsApp Confirmation', // Future proof for Mobile Money, Card, etc.
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
