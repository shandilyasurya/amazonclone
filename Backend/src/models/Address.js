const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Address = sequelize.define('Address', {
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
    }
  },
  full_name: DataTypes.STRING(100),
  line1: DataTypes.TEXT,
  line2: DataTypes.TEXT,
  city: DataTypes.STRING(80),
  state: DataTypes.STRING(80),
  pincode: DataTypes.STRING(10),
  phone: DataTypes.STRING(15),
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'addresses',
  timestamps: false,
});

module.exports = Address;
