import { colors } from "./theme";

export const pageStyle = {
  minHeight: "100vh",
  backgroundColor: colors.pageBg,
};

export const cardStyle = {
  backgroundColor: colors.cardBg,
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
};

export const primaryButtonStyle = {
  backgroundColor: colors.primary,
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "12px 16px",
  cursor: "pointer",
};

export const inputStyle = {
  width: "100%",
  padding: "12px",
  border: `1px solid ${colors.border}`,
  borderRadius: "4px",
  boxSizing: "border-box",
  backgroundColor: "#fff",
};