import React from 'react'

const Budget: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Budget
        </h1>
        <p style={{ color: '#64748b' }}>
          Track your monthly budget and spending by category.
        </p>
      </div>

      <div className="card text-center" style={{ padding: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          Budget Management
        </h3>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Budget tracking features will be implemented here. This will include:
        </p>
        <ul style={{ 
          textAlign: 'left', 
          maxWidth: '400px', 
          margin: '0 auto 2rem auto',
          color: '#64748b'
        }}>
          <li>Monthly budget setting by category</li>
          <li>Spending progress tracking</li>
          <li>Budget vs actual comparisons</li>
          <li>Overspending alerts</li>
        </ul>
      </div>
    </div>
  )
}

export default Budget