import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataIngestion from './pages/DataIngestion';
import ActionCenter from './pages/ActionCenter';
import LiquidityForecasts from './pages/LiquidityForecasts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="data" element={<DataIngestion />} />
          <Route path="actions" element={<ActionCenter />} />
          <Route path="forecasts" element={<LiquidityForecasts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
