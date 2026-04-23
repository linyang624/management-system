import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    signIn,
    signUp,
    updatePassword,
    clearAuthMessage,
} from '../../features/auth/authSlice';
import { validateAuthForm } from '../../utils/validators';
import { FiX } from "react-icons/fi";

function AuthForm({ mode }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, successMessage } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    //show password
    const [showPassword, setShowPassword] = useState(false);

    //mobile responsive
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        dispatch(clearAuthMessage());
        setIsSubmitted(false);
        setFormErrors({});
        setFormData({
            email: '',
            password: '',
        });
    }, [mode, dispatch]);

    useEffect(() => {
        if (mode === 'updatePassword' && successMessage) {
            setIsSubmitted(true);
        }
    }, [mode, successMessage]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        dispatch(clearAuthMessage());

        const errors = validateAuthForm(mode, formData);
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            if (mode === 'signin') {
                const data = await dispatch(
                    signIn({
                        email: formData.email,
                        password: formData.password,
                    })
                ).unwrap();

                if (data.user?.role === 'admin') {
                    navigate('/admin/products');
                }
                else {
                    navigate('/products');
                }
            } else if (mode === 'signup') {
                await dispatch(
                    signUp({
                        email: formData.email,
                        password: formData.password,
                    })
                ).unwrap();
            } else if (mode === 'updatePassword') {
                await dispatch(
                    updatePassword({
                        email: formData.email,
                    })
                ).unwrap();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (mode === 'updatePassword' && isSubmitted) {

        return (
            <div style={styles.page}>
                <div style={styles.card}>
                    <h1>Update Password Success Page</h1>
                    <p>We have sent the update password link to your email, please check that!</p>
                </div>
            </div>
        );
    }



    const titleMap = {
        signin: 'Sign in to your account',
        signup: 'Sign up an account',
        updatePassword: 'Update your password',
    };

    const buttonTextMap = {
        signin: loading ? 'Signing In...' : 'Sign In',
        signup: loading ? 'Signing Up...' : 'Sign Up',
        updatePassword: loading ? 'Submitting...' : 'Update Password',
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <button type="button" style={styles.closeButton} onClick={() => navigate("/signin")}>
                    <FiX />
                </button>
                <h1 style={styles.title}>{titleMap[mode]}</h1>

                {mode === "updatePassword" && (
                    <p style={styles.subtitle}>
                        Enter your email, and we will send you the recovery link.
                    </p>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                        />
                        {formErrors.email && <p>{formErrors.email}</p>}
                    </div>

                    {mode !== 'updatePassword' && (
                        <div style={styles.field}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={styles.passwordInput}
                                />
                                <button type="button" onClick={() => setShowPassword((prev) => !prev)}
                                    style={styles.showButton}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {formErrors.password && <p>{formErrors.password}</p>}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={styles.button}>
                        {buttonTextMap[mode]}
                    </button>
                </form>

                {error && <p>{error}</p>}
                {successMessage && mode !== 'updatePassword' && <p>{successMessage}</p>}

                {mode === 'signin' && (
                    <div style={isMobile ? styles.authLinksColumn : styles.authLinksRow}>
                        <div style={styles.inlineTextRow}>
                            <label style={styles.label}>Don&apos;t have an account?</label>
                            <Link to="/signup" style={styles.link}>Sign up</Link>
                        </div>
                        <Link to="/update-password" style={styles.link}>Forgot password?</Link>
                    </div>
                )}

                {mode === 'signup' && (
                    <div>
                        <p>
                            Already have an account? <Link to="/signin">Sign in</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
const styles = {
    title: {
        fontFamily: "Inter, Arial, sans-serif",
        textAlign: "center",
        margin: "0 0 16px 0",
        fontSize: "28px",
        fontWeight: "600",
        color: "#111827",
    },
    subtitle: {
        fontFamily: "Inter, Arial, sans-serif",
        textAlign: "center",
        margin: "0 0 32px 0",
        fontSize: "13px",
        lineHeight: "1.5",
        color: "#6b7280",

    },
    page: {
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "48px 24px",
        backgroundColor: "#f3f3f3",
    },
    card: {
        width: "100%",
        maxWidth: "500px",
        minHeight: "400px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "40px 36px",
        boxSizing: "border-box",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
        position: "relative",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        height: "44px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        outline: "none",
        fontSize: "14px",
        backgroundColor: "#ffffff",
    },
    button: {
        width: "100%",
        height: "44px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#4f46e5",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        marginTop: "4px",
    },
    helperText: {
        textAlign: "center",
        fontSize: "14px",
        color: "#6b7280",
        marginTop: "20px",
    },
    successCard: {
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#fff",
        padding: "32px 24px",
        borderRadius: "12px",
        boxSizing: "border-box",
        textAlign: "center",
    },
    label: {
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: "14px",
        color: "#6b7280",
    },
    closeButton: {
        position: "absolute",
        top: "16px",
        right: "16px",
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        fontSize: "32px",
        color: "#333",
        cursor: "pointer",
        lineHeight: 1,
    },
    link: {
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: "14px",
        color: "#4f46e5",
        textDecoration: "underline",
        fontWeight: "500",
    },
    authLinksRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20px",
        gap: "16px",
        flexWrap: "wrap",

    },
    authLinksColumn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        marginTop: "20px",

    },
    inlineTextRow: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    passwordWrapper: {
        position: "relative",
        width: "100%",
    },
    passwordInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 60px 12px 14px",
        height: "44px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        outline: "none",
        fontSize: "14px",
        backgroundColor: "#ffffff",
    },
    showButton: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        color: "#6b7280",
        cursor: "pointer",
        fontSize: "14px",
        padding: 0,
        textDecoration: "underline",
    },
};

export default AuthForm;