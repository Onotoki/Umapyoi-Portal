import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ color: "#ef4444", marginBottom: 12 }}>Something went wrong</h2>
          <pre style={{ background: "#1e1e1e", color: "#e5e5e5", padding: 16, borderRadius: 8, fontSize: 12, overflow: "auto", whiteSpace: "pre-wrap" }}>
            {this.state.error?.message || "Unknown error"}
            {"\n\n"}
            {this.state.info?.componentStack || ""}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
