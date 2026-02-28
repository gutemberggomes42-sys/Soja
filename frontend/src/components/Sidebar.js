import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Table, Database, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Colheita', path: '/colheita', icon: <Table size={20} /> },
    { name: 'Depositários', path: '/depositarios', icon: <Database size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-800 text-white h-screen fixed left-0 top-0">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        Soja Manager
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 transition-colors ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
