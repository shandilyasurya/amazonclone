const asyncHandler = require('../middleware/asyncHandler');
const { Product, ProductImage, Category } = require('../models/Index');
const { Op } = require('sequelize');

const getProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, sort, page, limit } = req.query;

  let whereClause = {};

  if (search) {
    whereClause.name = { [Op.iLike]: `%${search}%` };
  }

  if (category) {
    const cat = await Category.findOne({ where: { slug: category } });
    if (cat) {
      whereClause.category_id = cat.id;
    }
  }

  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price[Op.gte] = minPrice;
    if (maxPrice) whereClause.price[Op.lte] = maxPrice;
  }

  // Basic check: don't show items that are explicitly 0 stock to simulate soft delete exclusion
  // Note: users might want to see out of stock items, but spec says soft delete sets stock=0
  whereClause.stock = { [Op.gt]: 0 }; 

  let orderArr = [];
  if (sort === 'price_asc') orderArr.push(['price', 'ASC']);
  else if (sort === 'price_desc') orderArr.push(['price', 'DESC']);
  else orderArr.push(['rating', 'DESC']);

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;
  const offset = (pageNum - 1) * limitNum;

  const { count, rows } = await Product.findAndCountAll({
    where: whereClause,
    include: [
      { model: ProductImage, as: 'images', attributes: ['image_url'] },
      { model: Category, attributes: ['name', 'slug'] }
    ],
    order: orderArr,
    limit: limitNum,
    offset,
    distinct: true
  });

  res.json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: pageNum,
      pages: Math.ceil(count / limitNum)
    }
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [
      { model: ProductImage, as: 'images' },
      { model: Category, attributes: ['name', 'slug'] }
    ]
  });

  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category_id, stock, brand, is_prime } = req.body;

  const product = await Product.create({
    name,
    price,
    description,
    category_id,
    stock,
    brand,
    is_prime
  });

  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (product) {
    const updatedProduct = await product.update(req.body);
    res.json({ success: true, data: updatedProduct });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (product) {
    // Soft delete: set stock = 0
    await product.update({ stock: 0 });
    res.json({ success: true, message: 'Product removed (soft delete)' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
