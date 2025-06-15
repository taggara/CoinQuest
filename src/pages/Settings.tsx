import React from 'react'
import { User, Database, Download, Upload, Trash2 } from 'lucide-react'

const Settings: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Settings
        </h1>
        <p style={{ color: '#64748b' }}>
          Manage your account and application preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
        {/* Profile Section */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
            Profile
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '30px',
              backgroundColor: '#0ea5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <User size={24} />
            </div>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                User Account
              </p>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Manage your profile information
              </p>
            </div>
          </div>
        </div>

        {/* Database Section */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
            Database
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Database size={20} style={{ color: '#0ea5e9' }} />
            <div>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                PostgreSQL Connection
              </p>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Connected to: 192.168.4.52:5432/coinquest
              </p>
            </div>
          </div>
          <button className="btn btn-secondary">
            Configure Database
          </button>
        </div>

        {/* Data Management Section */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
            Data Management
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Download size={20} />
              Export Data
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Upload size={20} />
              Import Data
            </button>
            <button className="btn btn-danger" style={{ justifyContent: 'flex-start' }}>
              <Trash2 size={20} />
              Clear All Data
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
            About
          </h3>
          <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Backend:</strong> Python FastAPI</p>
            <p><strong>Frontend:</strong> React + TypeScript</p>
            <p><strong>Database:</strong> PostgreSQL</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings