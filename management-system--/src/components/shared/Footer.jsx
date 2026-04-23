import { Link } from "react-router-dom";
import { colors } from "../../styles/theme";

// Bottom footer section
// Shows copyright + social links + quick links
export default function Footer() {
  return (
    <footer style={footerWrapperStyle}>
      <div style={footerInnerStyle}>
        {/* Left section */}
        <div style={footerSectionStyle}>
          <span style={footerTextStyle}>©2022 All Rights Reserved.</span>
        </div>

        {/* Middle section */}
        <div style={footerSectionStyle}>
          <div style={socialListStyle}>
            <a href="/" style={socialLinkStyle} aria-label="YouTube">
              YouTube
            </a>
            <a href="/" style={socialLinkStyle} aria-label="Twitter">
              Twitter
            </a>
            <a href="/" style={socialLinkStyle} aria-label="Facebook">
              Facebook
            </a>
          </div>
        </div>

        {/* Right section */}
        <div style={footerSectionStyle}>
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
  padding: "20px 24px",
  marginTop: "40px",
};

const footerInnerStyle = {
  maxWidth: "1200px",
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
  justifyContent: "center",
  flex: 1,
  minWidth: "220px",
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
  fontSize: "14px",
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