import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;
