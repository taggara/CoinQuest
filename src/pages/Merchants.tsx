import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { api } from '@/services/api'

interface Merchant {
  id: number
  name: string
  category?: string
  created_at: string
}

const Merchants: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: ''
  })

  useEffect(() => {
    loadMerchants()
  }, [])

  const loadMerchants = async () => {
    try {
      const response = await api.get('/merchants')
      setMerchants(response.data)
    } catch (error) {
      console.error('Failed to load merchants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a merchant name')
      return
    }

    try {
      if (editingMerchant) {
        await api.put(`/merchants/${editingMerchant.id}`, formData)
      } else {
        await api.post('/merchants', formData)
      }
      
      await loadMerchants()
      setShowModal(false)
      setEditingMerchant(null)
      setFormData({ name: '', category: '' })
    } catch (error) {
      console.error('Failed to save merchant:', error)
      alert('Failed to save merchant')
    }
  }

  const handleEdit = (merchant: Merchant) => {
    setEditingMerchant(merchant)
    setFormData({
      name: merchant.name,
      category: merchant.category || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (merchant: Merchant) => {
    if (!confirm(`Are you sure you want to delete ${merchant.name}?`)) {
      return
    }

    try {
      await api.delete(`/merchants/${merchant.id}`)
      await loadMerchants()
    } catch (error) {
      console.error('Failed to delete merchant:', error)
      alert('Failed to delete merchant')
    }
  }

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (merchant.category && merchant.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
            Merchants
          </h1>
          <button
            onClick={() => {
              setEditingMerchant(null)
              setFormData({ name: '', category: '' })
              setShowModal(true)
            }}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Merchant
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '400px' }}>
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
            placeholder="Search merchants..."
            className="input"
            style={{ paddingLeft: '2.5rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="card">
          {filteredMerchants.length > 0 ? (
            <div>
              {filteredMerchants.map((merchant, index) => (
                <div
                  key={merchant.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 0',
                    borderBottom: index < filteredMerchants.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {merchant.name}
                    </p>
                    {merchant.category && (
                      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {merchant.category}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(merchant)}
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(merchant)}
                      className="btn btn-danger"
                      style={{ padding: '0.5rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '3rem' }}>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                {searchQuery ? 'No merchants found matching your search.' : 'No merchants yet.'}
              </p>
              <button
                onClick={() => {
                  setEditingMerchant(null)
                  setFormData({ name: '', category: '' })
                  setShowModal(true)
                }}
                className="btn btn-primary"
              >
                <Plus size={20} />
                Add Merchant
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            margin: '1rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              {editingMerchant ? 'Edit Merchant' : 'Add New Merchant'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Merchant Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter merchant name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter category (optional)"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {editingMerchant ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Merchants