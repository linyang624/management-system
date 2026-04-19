import { useState } from "react";

function UpdatePasswordPage() {
    const [formData, setFormData] = useState({
        email: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response  = await fetch('http://localhost:5001/api/auth/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if(!response.ok) {
                setError(data.message || 'Update Password Fail');
                return;
            }

            setSuccess(data.message || 'Update Password Successful');
            setIsSubmitted(true);
            console.log(data);
        }
        catch(err) {
            setError('Cannot connect to server');
        }
    }

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
                        type = "email"
                        name = "email"
                        value = {formData.email}
                        onChange={handleChange}
                    />
                </div>

                <button type='submit'>Update Password</button>
            </form>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    );
}

export default UpdatePasswordPage;