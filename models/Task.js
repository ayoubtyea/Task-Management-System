const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');
const User = require('./User');


const Task = sequelize.define('Task',  {
    title: {
        type: DataTypes.STRING,
        allowNull: false, 
   },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id',
        },
    },
}, { timestamps: true });

Task.belongsTo(User);
Task.belongsTo(Category);
User.hasMany(Task);
Category.hasMany(Task);


module.exports = Task;
