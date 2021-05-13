const Sequelize = require('sequelize');

module.exports = new Sequelize(process.env.DB, process.env.USER, process.env.PASS, {
    host: 'localhost',
    dialect: 'postgres',
});
