import React from "react";
import { FiAlertCircle } from "react-icons/fi";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={pageContainerStyle}>
          <div style={errorCardStyle}>
            <FiAlertCircle style={iconStyle} />

            <h2 style={messageStyle}>Oops, something went wrong!</h2>

            <button onClick={this.handleGoHome} style={homeButtonStyle}>
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

const pageContainerStyle = {
  width: "100%",
  maxWidth: "1320px",
  margin: "0 auto",
  padding: "56px 32px 48px",
  boxSizing: "border-box",
  fontFamily: "Arial, sans-serif",
};

const errorCardStyle = {
  width: "100%",
  minHeight: "460px",
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
};

const iconStyle = {
  width: "72px",
  height: "72px",
  color: "#4f46e5",
  marginBottom: "32px",
};

const messageStyle = {
  margin: "0 0 32px 0",
  color: "#111827",
  fontSize: "28px",
  fontWeight: "700",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
};

const homeButtonStyle = {
  width: "190px",
  height: "44px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#4f46e5",
  color: "#fff",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "700",
  fontFamily: "Arial, sans-serif",
};