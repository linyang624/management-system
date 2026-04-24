import { useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

function ErrorPage() {
    const navigate = useNavigate();

    //const message = location.state?.message || "Oops, something went wrong!"
    const message = "Oops, something went wrong!"

    return (
        <div style={pageContainerStyle}>
            <div style={errorCardStyle}>
                <FiAlertCircle style={iconStyle} />
                
                <h2 style={messageStyle}>{message}</h2>
                
                <button onClick={() => navigate("/")} style={homeButtonStyle}>
                    Go Home
                </button>
            </div>
        </div>
    );
}

export default ErrorPage;


/* =======================
   Styles
======================= */

const pageContainerStyle = {
  width: "100%",
  maxWidth: "1320px",
  margin: "0 auto",
  padding: "64px 32px 72px",
  boxSizing: "border-box",
  fontFamily: "Arial, sans-serif",
};

const errorCardStyle = {
  width: "100%",
  minHeight: "560px",
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
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
};