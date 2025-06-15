import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign } from 'lucide-react'
import { api } from '@/services/api'
import { formatCurrency } from '@/utils/formatters'

interface MonthlyData {
  income: number
  expenses: number
  balance: number
  budget_used: number
  budget_total: number
}

interface Transaction {
  id: number
  date: string
  type: 'income' | 'expense'
  amount: number
  category: { name: string }
  merchant: { name: string }
  notes?: string
}

const Dashboard: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [monthlyResponse, transactionsResponse] = await Promise.all([
          api.get('/dashboard/monthly'),
          api.get('/transactions?limit=5')
        ])
        
        setMonthlyData(monthlyResponse.data)
        setRecentTransactions(transactionsResponse.data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  const budgetPercentage = monthlyData 
    ? Math.min(100, (monthlyData.budget_used / monthlyData.budget_total) * 100)
    : 0

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748b' }}>
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: 'white',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '0.5rem' }}>
          Current Balance
        </h2>
        <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>
          {monthlyData ? formatCurrency(monthlyData.balance) : '$0.00'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#64748b' }}>
              Monthly Income
            </h3>
            <ArrowDownRight size={20} style={{ color: '#10b981' }} />
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            {monthlyData ? formatCurrency(monthlyData.income) : '$0.00'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#64748b' }}>
              Monthly Expenses
            </h3>
            <ArrowUpRight size={20} style={{ color: '#ef4444' }} />
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            {monthlyData ? formatCurrency(monthlyData.expenses) : '$0.00'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#64748b' }}>
              Budget Used
            </h3>
            <TrendingUp size={20} style={{ color: '#0ea5e9' }} />
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {budgetPercentage.toFixed(0)}%
          </p>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e2e8f0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${budgetPercentage}%`,
              height: '100%',
              backgroundColor: budgetPercentage > 90 ? '#ef4444' : budgetPercentage > 70 ? '#f59e0b' : '#10b981',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
            Recent Transactions
          </h3>
          <Link to="/transactions" className="btn btn-secondary">
            View All
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div>
            {recentTransactions.map((transaction) => (
              <Link
                key={transaction.id}
                to={`/transactions/${transaction.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  backgroundColor: transaction.type === 'expense' 
                    ? 'rgba(239, 68, 68, 0.1)' 
                    : 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  {transaction.type === 'expense' ? (
                    <ArrowUpRight size={18} style={{ color: '#ef4444' }} />
                  ) : (
                    <ArrowDownRight size={18} style={{ color: '#10b981' }} />
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    {transaction.merchant.name}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {transaction.category.name}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontWeight: '600',
                    color: transaction.type === 'expense' ? '#ef4444' : '#10b981',
                    marginBottom: '0.25rem'
                  }}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center" style={{ padding: '2rem' }}>
            <DollarSign size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b' }}>No transactions yet</p>
            <Link to="/transactions/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add Your First Transaction
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard