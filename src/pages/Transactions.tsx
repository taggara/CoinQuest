import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { api } from '@/services/api'
import { formatCurrency, formatDate } from '@/utils/formatters'

interface Transaction {
  id: number
  date: string
  type: 'income' | 'expense'
  amount: number
  category: { name: string }
  merchant: { name: string }
  notes?: string
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')

  useEffect(() => {
    loadTransactions()
  }, [typeFilter])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (typeFilter !== 'all') {
        params.append('transaction_type', typeFilter)
      }
      
      const response = await api.get(`/transactions?${params.toString()}`)
      setTransactions(response.data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction =>
    transaction.merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (transaction.notes && transaction.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
            Transactions
          </h1>
          <Link to="/transactions/new" className="btn btn-primary">
            <Plus size={20} />
            Add Transaction
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} 
            />
            <input
              type="text"
              placeholder="Search transactions..."
              className="input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="input"
            style={{ width: 'auto', minWidth: '150px' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="card">
          {filteredTransactions.length > 0 ? (
            <div>
              {filteredTransactions.map((transaction, index) => (
                <Link
                  key={transaction.id}
                  to={`/transactions/${transaction.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem 0',
                    borderBottom: index < filteredTransactions.length - 1 ? '1px solid #e2e8f0' : 'none',
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
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '3rem' }}>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                {searchQuery ? 'No transactions found matching your search.' : 'No transactions yet.'}
              </p>
              <Link to="/transactions/new" className="btn btn-primary">
                <Plus size={20} />
                Add Transaction
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Transactions