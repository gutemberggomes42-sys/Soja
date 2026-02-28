const express = require('express');
const cors = require('cors');
const { sequelize, Farm, Variety, Driver, Warehouse, Owner, HarvestEntry } = require('./models');

const app = express();
const port = 3001; // Change to 3001 to avoid common 3000 conflicts

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/farms', async (req, res) => {
  const farms = await Farm.findAll();
  res.json(farms);
});

app.get('/api/varieties', async (req, res) => {
  const varieties = await Variety.findAll();
  res.json(varieties);
});

app.get('/api/drivers', async (req, res) => {
  const drivers = await Driver.findAll();
  res.json(drivers);
});

app.get('/api/warehouses', async (req, res) => {
  const warehouses = await Warehouse.findAll();
  res.json(warehouses);
});

app.get('/api/owners', async (req, res) => {
  const owners = await Owner.findAll();
  res.json(owners);
});

app.get('/api/harvest-entries', async (req, res) => {
  const entries = await HarvestEntry.findAll({
    include: [Farm, Variety, Driver, Warehouse, Owner],
    order: [['dataPesagem', 'DESC']]
  });
  res.json(entries);
});

app.post('/api/harvest-entries', async (req, res) => {
  try {
    const { 
      dataPesagem, dataLancamento, description, romaneio, ticketArmazem, ticket, 
      pesoBruto, pesoTara, desconto, subTotal, pesoLiquido,
      farmName, varietyName, driverName, warehouseName, ownerName
    } = req.body;

    // findOrCreate each entity
    const [farm] = await Farm.findOrCreate({ where: { name: farmName } });
    const [variety] = await Variety.findOrCreate({ where: { name: varietyName } });
    const [driver] = await Driver.findOrCreate({ where: { name: driverName } });
    const [warehouse] = await Warehouse.findOrCreate({ where: { name: warehouseName } });
    const [owner] = await Owner.findOrCreate({ where: { name: ownerName } });

    const entry = await HarvestEntry.create({
      dataPesagem, dataLancamento, description, romaneio, ticketArmazem, ticket,
      pesoBruto, pesoTara, desconto, subTotal, pesoLiquido,
      FarmId: farm.id,
      VarietyId: variety.id,
      DriverId: driver.id,
      WarehouseId: warehouse.id,
      OwnerId: owner.id
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Summary routes for reports
app.get('/api/reports/production', async (req, res) => {
  // Logic for Image 1: Summarize by Farm and Variety
  const report = await HarvestEntry.findAll({
    attributes: [
      'FarmId',
      'VarietyId',
      [sequelize.fn('SUM', sequelize.col('pesoLiquido')), 'totalPesoLiquido'],
      [sequelize.fn('COUNT', sequelize.col('HarvestEntry.id')), 'entryCount']
    ],
    group: ['FarmId', 'VarietyId'],
    include: [Farm, Variety]
  });
  res.json(report);
});

app.get('/api/reports/deposits', async (req, res) => {
  // Logic for Image 2: Summarize by Owner and Warehouse
  const report = await HarvestEntry.findAll({
    attributes: [
      'OwnerId',
      'WarehouseId',
      [sequelize.fn('SUM', sequelize.col('pesoLiquido')), 'totalPesoLiquido']
    ],
    group: ['OwnerId', 'WarehouseId'],
    include: [Owner, Warehouse]
  });
  res.json(report);
});

// Database Sync and Start
sequelize.sync({ force: false }).then(async () => {
  // NO SEEDS - START FROM ZERO
  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });
});
