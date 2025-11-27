import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Could log to an external service here
    // console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    try {
      // Optionally clear storage if error is persistent
      // localStorage.clear();
    } catch (e) {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    // Try to reload the app
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-root">
          <div className="error-card">
            <div className="error-illustration"><FaExclamationTriangle className="FaIcon"/></div>
            <h2>Something went wrong</h2>
            <p>
              An unexpected error occurred. You can try reloading the app or
              clearing local data. If the problem persists, check the console
              for details.
            </p>
            <div className="error-actions">
              <button className="btn-primary" onClick={this.handleReset}>
                Reload App
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  try {
                    localStorage.removeItem('finance_wallets');
                    localStorage.removeItem('finance_budgets');
                    window.location.reload();
                  } catch (e) {
                    this.setState({ error: e });
                  }
                }}
              >
                Clear Local Data
              </button>
            </div>
            <details className="error-details">
              <summary>Technical details</summary>
              <pre>{this.state.error && this.state.error.toString()}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
