const asyncHandler = require('../middleware/asyncHandler');
const { Review, Product, User } = require('../models/Index');
const sequelize = require('../config/db');

const addReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, body, image_url } = req.body;

  const alreadyReviewed = await Review.findOne({
    where: { product_id: productId, user_id: req.user.id }
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = await Review.create({
    product_id: productId,
    user_id: req.user.id,
    rating: Number(rating),
    title,
    body,
    image_url: image_url || null
  });

  // Calculate new average rating & count
  const stats = await Review.findAll({
    where: { product_id: productId },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
    ]
  });

  const avgRating = stats[0].getDataValue('avgRating');
  const totalReviews = stats[0].getDataValue('totalReviews');

  await Product.update(
    { rating: parseFloat(avgRating).toFixed(1), review_count: totalReviews },
    { where: { id: productId } }
  );

  res.status(201).json({ success: true, data: review });
});

const getReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const { count, rows } = await Review.findAndCountAll({
    where: { product_id: req.params.productId },
    include: [{ model: User, attributes: ['name'] }],
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  res.json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page,
      pages: Math.ceil(count / limit)
    }
  });
});

module.exports = { addReview, getReviews };
