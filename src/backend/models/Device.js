const  aw1db=require('../bd/aw1db.js');


const { Sequelize, DataTypes } = require('sequelize');

/** Defino modelo de los datos */
const Device =aw1db.define('devices',{
     id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      state: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
    tableName: 'Devices',
    timestamps: false
});
module.exports = Device;