import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, Search, ClipboardList } from 'lucide-react';
import StorageService from '../services/StorageService';

const HarvestLog = () => {
  const [entries, setEntries] = useState([]);
  const [collections, setCollections] = useState({
    farms: [],
    varieties: [],
    drivers: [],
    warehouses: [],
    owners: []
  });
  
  const [formData, setFormData] = useState({
    dataPesagem: new Date().toISOString().split('T')[0],
    dataLancamento: new Date().toISOString().split('T')[0],
    farmName: '',
    varietyName: '',
    driverName: '',
    warehouseName: '',
    ownerName: '',
    romaneio: '',
    ticket: '',
    pesoBruto: '',
    pesoTara: '',
    desconto: '',
    pesoLiquido: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setEntries(StorageService.getHarvestEntries());
    setCollections(StorageService.getCollections());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };
    
    if (['pesoBruto', 'pesoTara', 'desconto'].includes(name)) {
      const bruto = parseFloat(name === 'pesoBruto' ? value : formData.pesoBruto) || 0;
      const tara = parseFloat(name === 'pesoTara' ? value : formData.pesoTara) || 0;
      const desc = parseFloat(name === 'desconto' ? value : formData.desconto) || 0;
      updatedData.pesoLiquido = bruto - tara - desc;
    }
    
    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.farmName || !formData.varietyName || !formData.pesoLiquido) {
      alert('Por favor, preencha os campos obrigatórios (Fazenda, Variedade e Pesos)');
      return;
    }

    setIsSubmitting(true);
    try {
      StorageService.addHarvestEntry(formData);
      setFormData({
        ...formData,
        romaneio: '',
        ticket: '',
        pesoBruto: '',
        pesoTara: '',
        desconto: '',
        pesoLiquido: 0
      });
      fetchData();
      alert('Registro salvo com sucesso!');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Erro ao salvar registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Cambuí Colheita de Soja</h1>
          <p className="text-blue-600 font-semibold">Safra 2024/2025</p>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-xl border border-blue-100">
          <ClipboardList className="text-blue-600" size={24} />
          <div>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Acumulado</p>
            <p className="text-2xl font-black text-blue-900 leading-none">
              {entries.reduce((acc, curr) => acc + curr.pesoLiquido, 0).toLocaleString()} <span className="text-sm font-normal">kg</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6 space-y-5">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-lg border-b border-slate-50 pb-4">
              <PlusCircle size={22} className="text-blue-600" />
              Novo Lançamento
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Data Pesagem</label>
                  <input type="date" name="dataPesagem" value={formData.dataPesagem} onChange={handleInputChange} className="w-full bg-slate-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Fazenda</label>
                  <input list="farms-list" name="farmName" value={formData.farmName} onChange={handleInputChange} placeholder="Digitar..." className="w-full bg-slate-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                  <datalist id="farms-list">{collections.farms.map(f => <option key={f.id} value={f.name} />)}</datalist>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Variedade</label>
                <input list="varieties-list" name="varietyName" value={formData.varietyName} onChange={handleInputChange} placeholder="Digitar..." className="w-full bg-slate-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                <datalist id="varieties-list">{collections.varieties.map(v => <option key={v.id} value={v.name} />)}</datalist>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Proprietário</label>
                <input list="owners-list" name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder="Digitar..." className="w-full bg-slate-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                <datalist id="owners-list">{collections.owners.map(o => <option key={o.id} value={o.name} />)}</datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Motorista</label>
                  <input list="drivers-list" name="driverName" value={formData.driverName} onChange={handleInputChange} placeholder="Digitar..." className="w-full bg-slate-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                  <datalist id="drivers-list">{collections.drivers.map(d => <option key={d.id} value={d.name} />)}</datalist>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Armazém</label>
                  <input list="warehouses-list" name="warehouseName" value={formData.warehouseName} onChange={handleInputChange} placeholder="Digitar..." className="w-full bg-slate-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                  <datalist id="warehouses-list">{collections.warehouses.map(w => <option key={w.id} value={w.name} />)}</datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Romaneio</label>
                  <input type="text" name="romaneio" value={formData.romaneio} onChange={handleInputChange} className="w-full bg-slate-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Ticket</label>
                  <input type="text" name="ticket" value={formData.ticket} onChange={handleInputChange} className="w-full bg-slate-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <label className="block text-[10px] font-black text-slate-400 uppercase">Bruto</label>
                  <input type="number" name="pesoBruto" value={formData.pesoBruto} onChange={handleInputChange} className="w-full bg-transparent border-0 p-0 text-sm font-bold focus:ring-0" />
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <label className="block text-[10px] font-black text-slate-400 uppercase">Tara</label>
                  <input type="number" name="pesoTara" value={formData.pesoTara} onChange={handleInputChange} className="w-full bg-transparent border-0 p-0 text-sm font-bold focus:ring-0" />
                </div>
                <div className="bg-red-50 p-2 rounded-lg border border-red-100">
                  <label className="block text-[10px] font-black text-red-300 uppercase">Desc.</label>
                  <input type="number" name="desconto" value={formData.desconto} onChange={handleInputChange} className="w-full bg-transparent border-0 p-0 text-sm font-bold text-red-600 focus:ring-0" />
                </div>
              </div>

              <div className="bg-blue-600 p-4 rounded-xl text-white shadow-lg shadow-blue-200">
                <label className="block text-[10px] font-black text-blue-200 uppercase tracking-widest">Peso Líquido Final</label>
                <div className="text-3xl font-black">{formData.pesoLiquido.toLocaleString()} <span className="text-sm font-normal">kg</span></div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${isSubmitting ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800 active:scale-95 shadow-slate-200'}`}
            >
              <Save size={20} />
              {isSubmitting ? 'Salvando...' : 'Salvar Registro'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList size={20} className="text-blue-600" />
                Últimos Lançamentos
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Buscar..." className="bg-slate-50 border-0 rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 w-48 transition-all" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-50">
                    <th className="px-6 py-4 uppercase text-[10px] tracking-widest">Data</th>
                    <th className="px-6 py-4 uppercase text-[10px] tracking-widest">Origem/Destino</th>
                    <th className="px-6 py-4 text-right uppercase text-[10px] tracking-widest">Líquido (kg)</th>
                    <th className="px-6 py-4 text-right uppercase text-[10px] tracking-widest">Sacos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">{new Date(entry.dataPesagem).toLocaleDateString('pt-BR')}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Ticket: {entry.ticket || '--'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{entry.Farm?.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          {entry.Variety?.name} • {entry.Warehouse?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-black text-slate-900">{entry.pesoLiquido.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Bruto: {entry.pesoBruto.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-black">
                          {(entry.pesoLiquido / 60).toFixed(1)}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {entries.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                          <Search size={48} strokeWidth={1} />
                          <p className="font-medium">Nenhum registro encontrado nesta safra</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarvestLog;
