import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, CreditCard, PieChart, Building2, Settings, Plus } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Budget', href: '/budget', icon: PieChart },
    { name: 'Merchants', href: '/merchants', icon: Building2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '256px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '1.5rem 0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#0ea5e9',
            margin: 0
          }}>
            CoinQuest
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#64748b',
            margin: '0.25rem 0 0 0'
          }}>
            Personal Finance Tracker
          </p>
        </div>

        <nav style={{ padding: '0 1rem' }}>
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  margin: '0.25rem 0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#0ea5e9' : '#64748b',
                  backgroundColor: isActive ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={20} style={{ marginRight: '0.75rem' }} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1rem', marginTop: '2rem' }}>
          <Link
            to="/transactions/new"
            className="btn btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <Plus size={20} />
            Add Transaction
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div style={{ 
        marginLeft: '256px', 
        flex: 1, 
        padding: '2rem',
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </div>
  )
}

export default Layout