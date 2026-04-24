import { Link } from "react-router-dom";
import { colors } from "../../styles/theme";
import { FaYoutube, FaTwitter, FaFacebookSquare } from "react-icons/fa";
import "../../responsive/Footer.css";

// Bottom footer section
// Shows copyright + social links + quick links
export default function Footer() {
  return (
    <footer className="footer-wrapper" style={footerWrapperStyle}>
      <div className="footer-inner" style={footerInnerStyle}>
        {/* Left section */}
        <div className="footer-section footer-left" style={{...footerSectionStyle, justifyContent: "flex-start"}}>
          <span style={footerTextStyle}>©2022 All Rights Reserved.</span>
        </div>

        {/* Middle section */}
        <div className="footer-section footer-social-section" style={{ ...footerSectionStyle, justifyContent: "center" }}>
          <div style={socialListStyle}>
            <a href="/" style={socialLinkStyle} aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="/" style={socialLinkStyle} aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="/" style={socialLinkStyle} aria-label="Facebook">
              <FaFacebookSquare />
            </a>
          </div>
        </div>

        {/* Right section */}
        <div className="footer-section footer-right" style={{ ...footerSectionStyle, justifyContent: "flex-end" }}>
          <div style={footerLinkGroupStyle}>
            <Link to="/" style={footerLinkStyle}>
              Contact us
            </Link>
            <Link to="/" style={footerLinkStyle}>
              Privacy Policies
            </Link>
            <Link to="/" style={footerLinkStyle}>
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =======================
   Styles
======================= */

const footerWrapperStyle = {
  backgroundColor: colors.headerBg,
  color: "#fff",
  padding: "20px 80px",
  marginTop: "40px",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const footerInnerStyle = {
  width: "100%",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const footerSectionStyle = {
  display: "flex",
  alignItems: "center",
//   justifyContent: "center",
//   flex: 1,
//   minWidth: "220px",
};

const footerTextStyle = {
  fontSize: "14px",
  color: "#fff",
};

const socialListStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
};

const socialLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "18px",
};

const footerLinkGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
};

const footerLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "14px",
};