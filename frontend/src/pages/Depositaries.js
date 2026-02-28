import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, Warehouse as WarehouseIcon, Wallet, ArrowRightLeft, Landmark } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const Depositaries = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await axios.get(`${API_URL}/reports/deposits`);
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestão de Depositários</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Landmark size={16} className="text-blue-600" />
            Controle de Saldo e Armazenagem • Safra 2024/2025
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
          <Wallet className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform" size={140} />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Geral Depositado</p>
          <div className="text-4xl font-black mt-2">{totalSacks.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-lg font-normal text-slate-400">sacos</span></div>
          <div className="flex items-center gap-2 mt-4 text-sm font-bold text-blue-400">
            <ArrowRightLeft size={16} />
            Equivalente a {totalTons.toLocaleString(undefined, { maximumFractionDigits: 1 })} Toneladas
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Armazéns Ativos</p>
            <div className="text-3xl font-black text-slate-800 mt-1">{[...new Set(report.map(r => r.WarehouseId))].length}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Unidades recebendo carga</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Proprietários</p>
            <div className="text-3xl font-black text-slate-800 mt-1">{[...new Set(report.map(r => r.OwnerId))].length}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Contas vinculadas</p>
          </div>
        </div>
      </div>

      {/* Detailed List */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <UserCheck className="text-blue-600" size={24} />
            Saldos por Conta
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-5">Proprietário / Titular</th>
                <th className="px-8 py-5">Local de Depósito</th>
                <th className="px-8 py-5 text-right">Peso (T)</th>
                <th className="px-8 py-5 text-right">Saldo (Sacos)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {report.map((item, idx) => {
                const kg = parseFloat(item.totalPesoLiquido) || 0;
                const tons = kg / 1000;
                const sacks = kg / 60;
                
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-800 uppercase tracking-tight">{item.Owner?.name}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-bold">
                        <WarehouseIcon size={16} className="text-blue-500" />
                        {item.Warehouse?.name}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-bold text-slate-500">
                      {tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-flex flex-col items-end">
                        <span className="text-lg font-black text-slate-900">{sacks.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sacos de 60kg</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {report.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-200">
                      <Landmark size={80} strokeWidth={1} />
                      <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">Nenhum depósito efetuado</p>
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

export default Depositaries;
