import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api } from '@/services/api'

interface Category {
  id: number
  name: string
  type: string
}

interface Merchant {
  id: number
  name: string
  category?: string
}

interface Transaction {
  id: number
  date: string
  type: 'income' | 'expense'
  amount: number
  category_id: number
  merchant_id: number
  notes?: string
}

const EditTransaction: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [merchants, setMerchants] = useState<Merchant[]>([])
  
  const [formData, setFormData] = useState({
    type: 'expense' as 'expense' | 'income',
    amount: '',
    category_id: '',
    merchant_id: '',
    date: '',
    notes: ''
  })

  useEffect(() => {
    if (id) {
      loadTransaction()
    }
  }, [id])

  useEffect(() => {
    if (formData.type) {
      loadCategories()
    }
  }, [formData.type])

  const loadTransaction = async () => {
    try {
      const [transactionResponse, merchantsResponse] = await Promise.all([
        api.get(`/transactions/${id}`),
        api.get('/merchants')
      ])
      
      const transaction = transactionResponse.data
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category_id: transaction.category_id.toString(),
        merchant_id: transaction.merchant_id.toString(),
        date: transaction.date,
        notes: transaction.notes || ''
      })
      
      setMerchants(merchantsResponse.data)
    } catch (error) {
      console.error('Failed to load transaction:', error)
      navigate('/transactions')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await api.get(`/categories?transaction_type=${formData.type}`)
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.category_id || !formData.merchant_id) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      await api.put(`/transactions/${id}`, {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
        merchant_id: parseInt(formData.merchant_id)
      })
      
      navigate(`/transactions/${id}`)
    } catch (error) {
      console.error('Failed to update transaction:', error)
      alert('Failed to update transaction')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate(`/transactions/${id}`)}
          className="btn btn-secondary"
          style={{ marginBottom: '1rem' }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
          Edit Transaction
        </h1>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          {/* Transaction Type */}
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`btn ${formData.type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setFormData({ ...formData, type: 'expense', category_id: '' })}
              >
                Expense
              </button>
              <button
                type="button"
                className={`btn ${formData.type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setFormData({ ...formData, type: 'income', category_id: '' })}
              >
                Income
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="input"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Merchant */}
          <div className="form-group">
            <label className="form-label">Merchant *</label>
            <select
              className="input"
              value={formData.merchant_id}
              onChange={(e) => setFormData({ ...formData, merchant_id: e.target.value })}
              required
            >
              <option value="">Select a merchant</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              type="date"
              className="input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Add notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => navigate(`/transactions/${id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTransaction