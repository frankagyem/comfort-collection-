import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      deliveryAddress,
      deliveryLocation,
      customerName,
      phone,
      paymentMethod,
      itemsPrice,
      deliveryFee,
      totalPrice,
      referralCode,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      // Determine delivery fee dynamically if not strictly trusting frontend
      // e.g. if deliveryLocation === 'GHANA' || 'UK' || 'NIGERIA' -> 0 else configurable

      const order = new Order({
        user: req.user ? req.user._id : null, // Optional if soft auth applied
        customerName,
        phone,
        orderItems,
        deliveryAddress,
        deliveryLocation,
        paymentMethod,
        itemsPrice,
        deliveryFee,
        totalPrice,
        referralCode,
      });

      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public/Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      // Future logic for saving payment details from gateway here

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'pending', 'confirmed', 'delivered', 'cancelled'
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      if (status === 'delivered') {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
};
