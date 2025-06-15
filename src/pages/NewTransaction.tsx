import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
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

const NewTransaction: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [merchants, setMerchants] = useState<Merchant[]>([])
  
  const [formData, setFormData] = useState({
    type: 'expense' as 'expense' | 'income',
    amount: '',
    category_id: '',
    merchant_id: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  useEffect(() => {
    loadFormData()
  }, [formData.type])

  const loadFormData = async () => {
    try {
      const [categoriesResponse, merchantsResponse] = await Promise.all([
        api.get(`/categories?transaction_type=${formData.type}`),
        api.get('/merchants')
      ])
      
      setCategories(categoriesResponse.data)
      setMerchants(merchantsResponse.data)
    } catch (error) {
      console.error('Failed to load form data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.category_id || !formData.merchant_id) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
        merchant_id: parseInt(formData.merchant_id)
      })
      
      navigate('/transactions')
    } catch (error) {
      console.error('Failed to create transaction:', error)
      alert('Failed to create transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
          style={{ marginBottom: '1rem' }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
          Add New Transaction
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
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewTransaction