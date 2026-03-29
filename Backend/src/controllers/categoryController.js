const asyncHandler = require('../middleware/asyncHandler');
const { sequelize } = require('../models/Index');

const getCategories = asyncHandler(async (req, res) => {
  const [categories] = await sequelize.query(`
    SELECT 
      c.id, c.name, c.slug, c.image_url,
      COUNT(p.id)::int AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id, c.name, c.slug, c.image_url
    ORDER BY c.id ASC
  `);

  res.json({ success: true, data: categories });
});

module.exports = { getCategories };
