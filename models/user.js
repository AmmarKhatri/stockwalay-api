const Sequelize = require('sequelize');
const db = require("../config/database");

const User = db.define('user', {
    id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    firstname: {
        type: Sequelize.DataTypes.STRING,
    },
    lastname: {
        type: Sequelize.DataTypes.STRING,
    },
    email: {
        type: Sequelize.DataTypes.STRING,
    },
    password: {
        type: Sequelize.DataTypes.STRING,
    },
    country: {
        type: Sequelize.DataTypes.STRING,
    },
    phonenumber: {
        type: Sequelize.DataTypes.STRING,
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
    },
    status: {
        type: Sequelize.DataTypes.STRING,
    }
},{
    tableName: 'users'
});

module.exports = User;