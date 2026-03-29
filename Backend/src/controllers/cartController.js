const asyncHandler = require('../middleware/asyncHandler');
const { CartItem, Product, ProductImage } = require('../models/Index');

const getCart = asyncHandler(async (req, res) => {
  let cartItems;
  try {
    cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          include: [{ model: ProductImage, as: 'images', attributes: ['image_url'] }],
        },
      ],
      order: [['added_at', 'DESC']],
    });
  } catch {
    // Fallback without images if join fails
    cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product }],
      order: [['id', 'DESC']],
    });
  }

  res.json({ success: true, data: cartItems });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  let cartItem = await CartItem.findOne({
    where: { user_id: req.user.id, product_id: productId }
  });

  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      user_id: req.user.id,
      product_id: productId,
      quantity
    });
  }

  res.status(201).json({ success: true, data: cartItem });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cartItem = await CartItem.findOne({
    where: { id: req.params.itemId, user_id: req.user.id }
  });

  if (cartItem) {
    cartItem.quantity = quantity;
    await cartItem.save();
    res.json({ success: true, data: cartItem });
  } else {
    res.status(404);
    throw new Error('Cart item not found');
  }
});

const removeCartItem = asyncHandler(async (req, res) => {
  const deletedCount = await CartItem.destroy({
    where: { id: req.params.itemId, user_id: req.user.id }
  });

  if (deletedCount) {
    res.json({ success: true, message: 'Item removed from cart' });
  } else {
    res.status(404);
    throw new Error('Cart item not found');
  }
});

const clearCart = asyncHandler(async (req, res) => {
  await CartItem.destroy({
    where: { user_id: req.user.id }
  });
  
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
