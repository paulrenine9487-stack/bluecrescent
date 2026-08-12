import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)',
            borderTop: '4px solid #00A198'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#EFF6FF',
              color: '#003E8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 20px auto',
              fontWeight: '800'
            }}>
              !
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#071C3B', margin: '0 0 10px 0' }}>
              Something went wrong loading this section
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              Don't worry! Your session is safe. Click below to refresh and load the latest updates.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg, #071C3B 0%, #003E8A 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(7, 28, 59, 0.2)'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
