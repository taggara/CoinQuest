import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { api } from '@/services/api'
import { formatCurrency, formatDate } from '@/utils/formatters'

interface Transaction {
  id: number
  date: string
  type: 'income' | 'expense'
  amount: number
  category: { id: number; name: string }
  merchant: { id: number; name: string }
  notes?: string
  created_at: string
}

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (id) {
      loadTransaction()
    }
  }, [id])

  const loadTransaction = async () => {
    try {
      const response = await api.get(`/transactions/${id}`)
      setTransaction(response.data)
    } catch (error) {
      console.error('Failed to load transaction:', error)
      navigate('/transactions')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!transaction || !confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    try {
      setDeleting(true)
      await api.delete(`/transactions/${transaction.id}`)
      navigate('/transactions')
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      alert('Failed to delete transaction')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="text-center" style={{ padding: '3rem' }}>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          Transaction not found
        </p>
        <Link to="/transactions" className="btn btn-primary">
          Back to Transactions
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/transactions')}
          className="btn btn-secondary"
          style={{ marginBottom: '1rem' }}
        >
          <ArrowLeft size={20} />
          Back to Transactions
        </button>
        
        <div className="flex items-center justify-between">
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
            Transaction Details
          </h1>
          
          <div className="flex gap-2">
            <Link
              to={`/transactions/${transaction.id}/edit`}
              className="btn btn-secondary"
            >
              <Edit size={20} />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={deleting}
            >
              <Trash2 size={20} />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {/* Amount Card */}
      <div style={{
        background: transaction.type === 'expense' 
          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: 'white',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          marginBottom: '1rem'
        }}>
          {transaction.type === 'expense' ? (
            <ArrowUpRight size={24} />
          ) : (
            <ArrowDownRight size={24} />
          )}
        </div>
        
        <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
          {transaction.type === 'expense' ? '-' : '+'}
          {formatCurrency(transaction.amount)}
        </p>
        
        <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: 0 }}>
          {formatDate(transaction.date)}
        </p>
      </div>

      {/* Details Card */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
          Transaction Information
        </h3>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              Type
            </label>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              backgroundColor: transaction.type === 'expense' 
                ? 'rgba(239, 68, 68, 0.1)' 
                : 'rgba(16, 185, 129, 0.1)',
              color: transaction.type === 'expense' ? '#ef4444' : '#10b981',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              {transaction.type === 'expense' ? 'Expense' : 'Income'}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              Category
            </label>
            <p style={{ fontSize: '1rem', fontWeight: '500' }}>
              {transaction.category.name}
            </p>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              Merchant
            </label>
            <p style={{ fontSize: '1rem', fontWeight: '500' }}>
              {transaction.merchant.name}
            </p>
          </div>

          {transaction.notes && (
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#64748b',
                marginBottom: '0.5rem'
              }}>
                Notes
              </label>
              <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                {transaction.notes}
              </p>
            </div>
          )}

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              Created
            </label>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {new Date(transaction.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetail