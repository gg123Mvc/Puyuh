import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#f8fafc',
          fontFamily: "'Inter', sans-serif"
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '80px', height: '80px', background: '#fee2e2', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
              color: '#ef4444'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            
            <h1 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '1.8rem' }}>System Encountered Error</h1>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Oops! Sistem mengalami kendala tak terduga.
            </p>

            <div style={{ 
              textAlign: 'left', 
              background: '#0f172a', 
              color: '#f1f5f9', 
              padding: '16px', 
              borderRadius: '12px', 
              fontSize: '0.85rem', 
              fontFamily: 'monospace',
              maxHeight: '200px',
              overflow: 'auto',
              marginBottom: '24px'
            }}>
              {this.state.error && this.state.error.toString()}
            </div>

            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '12px 32px', 
                background: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '50px', 
                fontSize: '1rem', 
                fontWeight: '600', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Restart System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
