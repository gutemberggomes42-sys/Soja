import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Map, Sprout, BarChart3, ArrowUpRight, Target } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const Dashboard = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await axios.get(`${API_URL}/reports/production`);
      setReport(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report:', error);
      setLoading(false);
    }
  };

  const totalKg = report.reduce((acc, curr) => acc + (parseFloat(curr.totalPesoLiquido) || 0), 0);
  const totalTons = totalKg / 1000;
  const totalSacks = totalKg / 60;
  // Mock total area since it's dynamic now
  const totalArea = 4346.75; 
  const avgProductivity = totalArea > 0 ? totalSacks / totalArea : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Painel de Produção</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Target size={16} className="text-blue-600" />
            Monitoramento Safra 2024/2025
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-sm font-bold text-slate-600">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Sistema em Tempo Real
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<TrendingUp />} 
          label="Produção Total" 
          value={`${totalTons.toLocaleString(undefined, { maximumFractionDigits: 1 })} T`}
          subValue={`${totalKg.toLocaleString()} kg`}
          color="blue"
        />
        <StatCard 
          icon={<BarChart3 />} 
          label="Volume em Sacos" 
          value={`${totalSacks.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subValue="Sacos de 60kg"
          color="green"
        />
        <StatCard 
          icon={<ArrowUpRight />} 
          label="Produtividade Média" 
          value={`${avgProductivity.toLocaleString(undefined, { maximumFractionDigits: 1 })}`}
          subValue="Sacos por Há"
          color="amber"
        />
        <StatCard 
          icon={<Map />} 
          label="Área Mapeada" 
          value="4.346,7"
          subValue="Hectares (Há)"
          color="indigo"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Sprout className="text-green-600" size={24} />
              Performance por Variedade
            </h2>
            <p className="text-sm text-slate-500 font-medium">Resumo consolidado por fazenda e cultura</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-5">Fazenda</th>
                <th className="px-8 py-5">Variedade</th>
                <th className="px-8 py-5 text-right">Peso (T)</th>
                <th className="px-8 py-5 text-right">Total Sacos</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {report.map((item, idx) => {
                const kg = parseFloat(item.totalPesoLiquido) || 0;
                const tons = kg / 1000;
                const sacks = kg / 60;

                return (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{item.Farm?.name}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                        {item.Variety?.name}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-bold text-slate-700">
                      {tons.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="font-black text-slate-900">{sacks.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Ativo
                      </span>
                    </td>
                  </tr>
                );
              })}
              {report.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <BarChart3 size={64} strokeWidth={1} />
                      <div>
                        <p className="text-xl font-bold text-slate-400">Nenhum dado registrado</p>
                        <p className="text-sm font-medium">Inicie os lançamentos na aba de Colheita</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${colors[color]}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
      <p className="text-xs font-semibold text-slate-500 mt-1">{subValue}</p>
    </div>
  );
};

export default Dashboard;
