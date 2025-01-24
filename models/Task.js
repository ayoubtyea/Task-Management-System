const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');


const Task = sequelize.define('task',  {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,      
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {timestamps: true});

Task.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Task;
