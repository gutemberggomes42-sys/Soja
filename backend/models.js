const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

const Farm = sequelize.define('Farm', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  areaPlantada: { type: DataTypes.FLOAT, defaultValue: 0 }
});

const Variety = sequelize.define('Variety', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const Driver = sequelize.define('Driver', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const Warehouse = sequelize.define('Warehouse', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const Owner = sequelize.define('Owner', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const HarvestEntry = sequelize.define('HarvestEntry', {
  dataPesagem: { type: DataTypes.DATEONLY },
  dataLancamento: { type: DataTypes.DATEONLY },
  description: { type: DataTypes.STRING },
  romaneio: { type: DataTypes.STRING },
  ticketArmazem: { type: DataTypes.STRING },
  ticket: { type: DataTypes.STRING },
  pesoBruto: { type: DataTypes.FLOAT },
  pesoTara: { type: DataTypes.FLOAT },
  desconto: { type: DataTypes.FLOAT },
  subTotal: { type: DataTypes.FLOAT },
  pesoLiquido: { type: DataTypes.FLOAT },
  sacos: { type: DataTypes.VIRTUAL, get() { return this.pesoLiquido / 60; } } // Assuming 60kg per sack
});

// Relationships
HarvestEntry.belongsTo(Farm);
HarvestEntry.belongsTo(Variety);
HarvestEntry.belongsTo(Driver);
HarvestEntry.belongsTo(Warehouse);
HarvestEntry.belongsTo(Owner);

Farm.hasMany(HarvestEntry);
Variety.hasMany(HarvestEntry);
Driver.hasMany(HarvestEntry);
Warehouse.hasMany(HarvestEntry);
Owner.hasMany(HarvestEntry);

module.exports = {
  sequelize,
  Farm,
  Variety,
  Driver,
  Warehouse,
  Owner,
  HarvestEntry
};
