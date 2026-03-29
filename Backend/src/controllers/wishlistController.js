const asyncHandler = require('../middleware/asyncHandler');
const { WishlistItem, Product, ProductImage } = require('../models/Index');

const getWishlist = asyncHandler(async (req, res) => {
  const items = await WishlistItem.findAll({
    where: { user_id: req.user.id },
    include: [
      {
        model: Product,
        include: [{ model: ProductImage, as: 'images', attributes: ['image_url'] }]
      }
    ]
  });

  res.json({ success: true, data: items });
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const exists = await WishlistItem.findOne({
    where: { user_id: req.user.id, product_id: productId }
  });

  if (exists) {
    res.status(400);
    throw new Error('Product already in wishlist');
  }

  const item = await WishlistItem.create({
    user_id: req.user.id,
    product_id: productId
  });

  res.status(201).json({ success: true, data: item });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const deletedCount = await WishlistItem.destroy({
    where: { product_id: req.params.productId, user_id: req.user.id }
  });

  if (deletedCount) {
    res.json({ success: true, message: 'Removed from wishlist' });
  } else {
    res.status(404);
    throw new Error('Item not found in wishlist');
  }
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
