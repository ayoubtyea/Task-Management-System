const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  }, { timestamps: true });
  

  Category.belongsTo(User); 
  User.hasMany(Category);

  module.exports = Category;