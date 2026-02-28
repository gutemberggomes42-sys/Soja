import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HarvestLog from './pages/HarvestLog';
import Depositaries from './pages/Depositaries';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/colheita" element={<HarvestLog />} />
          <Route path="/depositarios" element={<Depositaries />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
