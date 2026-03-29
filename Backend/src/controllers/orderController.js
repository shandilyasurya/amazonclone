const asyncHandler = require('../middleware/asyncHandler');
const { Order, OrderItem, CartItem, Product, Address, ProductImage, sequelize } = require('../models/Index');

const placeOrder = asyncHandler(async (req, res) => {
  const address_id = req.body.addressId || req.body.address_id;

  const cartItems = await CartItem.findAll({
    where: { user_id: req.user.id },
    include: [{ model: Product }]
  });

  if (!cartItems || cartItems.length === 0) {
    res.status(400);
    throw new Error('No items in cart');
  }

  const transaction = await sequelize.transaction();

  try {
    let subtotal = 0;
    
    // Verify stock and calculate subtotal
    for (const item of cartItems) {
      if (item.Product.stock < item.quantity) {
        throw new Error(`Product ${item.Product.name} is out of stock`);
      }
      subtotal += item.quantity * item.Product.price;
    }

    const tax = subtotal * 0.18; // 18% tax example
    const total = subtotal + tax;

    const order = await Order.create({
      user_id: req.user.id,
      address_id,
      subtotal,
      tax,
      total,
      status: 'pending'
    }, { transaction });

    for (const item of cartItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.Product.price
      }, { transaction });

      // Deduct stock
      await item.Product.decrement('stock', { by: item.quantity, transaction });
    }

    // Clear cart
    await CartItem.destroy({ where: { user_id: req.user.id }, transaction });

    await transaction.commit();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    if (transaction && !transaction.finished) {
       await transaction.rollback();
    }
    res.status(400);
    throw new Error(error.message);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { user_id: req.user.id },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          { 
            model: Product, 
            attributes: ['name', 'price'],
            include: [{ model: ProductImage, as: 'images', attributes: ['image_url'] }]
          }
        ]
      }
    ],
    order: [['placed_at', 'DESC']]
  });

  res.json({ success: true, data: orders });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, user_id: req.user.id },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          { 
            model: Product,
            include: [{ model: ProductImage, as: 'images' }]
          }
        ]
      },
      { model: Address }
    ]
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({ success: true, data: order });
});

module.exports = { placeOrder, getOrders, getOrderById };
