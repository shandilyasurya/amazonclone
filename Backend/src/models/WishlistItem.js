const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WishlistItem = sequelize.define('WishlistItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
}, {
  tableName: 'wishlist_items',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id']
    }
  ]
});

module.exports = WishlistItem;
