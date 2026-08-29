import React, { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#020617',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '20px',
              padding: '28px',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <h2
              style={{
                color: '#22d3ee',
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '10px',
                fontFamily: 'monospace',
              }}
            >
              UNBLOCKED VAULT RECOVERY
            </h2>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '13px',
                marginBottom: '16px',
                lineHeight: 1.5,
              }}
            >
              The application encountered a runtime issue. Click below to clear
              stored session data and restore the official games list.
            </p>
            <div
              style={{
                backgroundColor: '#020617',
                color: '#f43f5e',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '12px',
                textAlign: 'left',
                overflow: 'auto',
                marginBottom: '20px',
                border: '1px solid #334155',
                fontFamily: 'monospace',
              }}
            >
              {this.state.error?.message || String(this.state.error)}
            </div>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                } catch (e) {}
                window.location.reload();
              }}
              style={{
                backgroundColor: '#06b6d4',
                color: '#020617',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.4)',
              }}
            >
              Reset Cache & Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}

export default App;

