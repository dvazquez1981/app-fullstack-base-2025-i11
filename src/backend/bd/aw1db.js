
const { Sequelize, DataTypes } = require('sequelize');
const mysql2 = require('mysql2');

const aw1db = new Sequelize('smart_home', 'root', 'userpass', {
    host: 'mysql-server',
    port: 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
  
  // Conexión y backup cada 3 minutos
  (async () => {
    try {
      await aw1db.authenticate();
      console.log('Conexión a MySQL OK.');
  
    } catch (error) {
      console.error('Error al conectar a MySQL:', error);
    }
  })();
  
  module.exports = aw1db;
