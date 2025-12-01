const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Produkt = sequelize.define('Produkt', {
  nazwa: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, allowNull: false },
  cena: { type: DataTypes.FLOAT, defaultValue: 0 },
  kategoria: { type: DataTypes.STRING, defaultValue: "" },
  stan_magazynu: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'produkty',
  timestamps: false
});

module.exports = Produkt;
