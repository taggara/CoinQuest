import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import TransactionDetail from './pages/TransactionDetail'
import NewTransaction from './pages/NewTransaction'
import EditTransaction from './pages/EditTransaction'
import Budget from './pages/Budget'
import Merchants from './pages/Merchants'
import Settings from './pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/new" element={<NewTransaction />} />
        <Route path="/transactions/:id" element={<TransactionDetail />} />
        <Route path="/transactions/:id/edit" element={<EditTransaction />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/merchants" element={<Merchants />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App