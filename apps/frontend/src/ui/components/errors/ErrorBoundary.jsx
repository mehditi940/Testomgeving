import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, maxWidth: 720, margin: "10vh auto", textAlign: "center" }}>
          <h2>Er is iets misgegaan</h2>
          <p style={{ color: "#555" }}>
            Er trad een onverwachte fout op. Vernieuw de pagina of ga terug naar de startpagina.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={this.handleReload}>Pagina vernieuwen</button>
            <a href="/" style={{ textDecoration: "none" }}>
              <button>Ga naar home</button>
            </a>
          </div>
          {process.env.NODE_ENV !== "production" && this.state.error && (
            <pre style={{ textAlign: "left", overflowX: "auto", marginTop: 16 }}>
              {String(this.state.error?.stack || this.state.error)}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

