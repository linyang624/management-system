import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword, clearAuthMessage } from '../features/auth/authSlice';

function UpdatePasswordPage() {
    const dispatch = useDispatch();
    const { loading, error, successMessage } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (successMessage) {
            setIsSubmitted(true);
        }
    }, [successMessage]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        dispatch(clearAuthMessage());
        dispatch(updatePassword(formData));

    };

    if(isSubmitted) {
        return (
            <div>
                <h1>Update Password Success Page</h1>
                <p>We have sent the update password link to your email, please check that!</p>
            </div>
        )
    }

    return (
        <div>
            <h1>Update your password</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type = "text"
                        name = "email"
                        value = {formData.email}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Update Password'}
                </button>
            </form>

            {error && <p>{error}</p>}
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
}

export default UpdatePasswordPage;