const STORAGE_KEY = 'soja_app_data';

const getInitialData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {
    entries: [],
    farms: [],
    varieties: [],
    drivers: [],
    warehouses: [],
    owners: []
  };
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const findOrCreate = (collection, name) => {
  let item = collection.find(i => i.name.toLowerCase() === name.trim().toLowerCase());
  if (!item) {
    item = { id: Date.now() + Math.random(), name: name.trim() };
    collection.push(item);
  }
  return item;
};

const StorageService = {
  getHarvestEntries: () => {
    const data = getInitialData();
    // Return entries with populated data
    return data.entries.map(entry => ({
      ...entry,
      Farm: data.farms.find(f => f.id === entry.FarmId),
      Variety: data.varieties.find(v => v.id === entry.VarietyId),
      Driver: data.drivers.find(d => d.id === entry.DriverId),
      Warehouse: data.warehouses.find(w => w.id === entry.WarehouseId),
      Owner: data.owners.find(o => o.id === entry.OwnerId)
    })).sort((a, b) => new Date(b.dataPesagem) - new Date(a.dataPesagem));
  },

  addHarvestEntry: (formData) => {
    const data = getInitialData();
    
    const farm = findOrCreate(data.farms, formData.farmName);
    const variety = findOrCreate(data.varieties, formData.varietyName);
    const driver = findOrCreate(data.drivers, formData.driverName);
    const warehouse = findOrCreate(data.warehouseName ? data.warehouses : [], formData.warehouseName || 'Geral');
    const owner = findOrCreate(data.ownerName ? data.owners : [], formData.ownerName || 'Geral');

    // Add warehouse and owner to collections if they were new
    if (!data.warehouses.find(w => w.id === warehouse.id)) data.warehouses.push(warehouse);
    if (!data.owners.find(o => o.id === owner.id)) data.owners.push(owner);

    const newEntry = {
      id: Date.now(),
      dataPesagem: formData.dataPesagem,
      dataLancamento: formData.dataLancamento,
      romaneio: formData.romaneio,
      ticket: formData.ticket,
      pesoBruto: parseFloat(formData.pesoBruto) || 0,
      pesoTara: parseFloat(formData.pesoTara) || 0,
      desconto: parseFloat(formData.desconto) || 0,
      pesoLiquido: parseFloat(formData.pesoLiquido) || 0,
      FarmId: farm.id,
      VarietyId: variety.id,
      DriverId: driver.id,
      WarehouseId: warehouse.id,
      OwnerId: owner.id
    };

    data.entries.push(newEntry);
    saveData(data);
    return newEntry;
  },

  getProductionReport: () => {
    const entries = StorageService.getHarvestEntries();
    const report = [];

    entries.forEach(entry => {
      const existing = report.find(r => r.FarmId === entry.FarmId && r.VarietyId === entry.VarietyId);
      if (existing) {
        existing.totalPesoLiquido += entry.pesoLiquido;
        existing.entryCount += 1;
      } else {
        report.push({
          FarmId: entry.FarmId,
          VarietyId: entry.VarietyId,
          totalPesoLiquido: entry.pesoLiquido,
          entryCount: 1,
          Farm: entry.Farm,
          Variety: entry.Variety
        });
      }
    });
    return report;
  },

  getDepositsReport: () => {
    const entries = StorageService.getHarvestEntries();
    const report = [];

    entries.forEach(entry => {
      const existing = report.find(r => r.OwnerId === entry.OwnerId && r.WarehouseId === entry.WarehouseId);
      if (existing) {
        existing.totalPesoLiquido += entry.pesoLiquido;
      } else {
        report.push({
          OwnerId: entry.OwnerId,
          WarehouseId: entry.WarehouseId,
          totalPesoLiquido: entry.pesoLiquido,
          Owner: entry.Owner,
          Warehouse: entry.Warehouse
        });
      }
    });
    return report;
  },

  getCollections: () => {
    const data = getInitialData();
    return {
      farms: data.farms,
      varieties: data.varieties,
      drivers: data.drivers,
      warehouses: data.warehouses,
      owners: data.owners
    };
  }
};

export default StorageService;
