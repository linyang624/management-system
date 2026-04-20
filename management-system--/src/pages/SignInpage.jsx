import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, clearAuthMessage } from '../features/auth/authSlice';

function SignInPage() {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState ({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    dispatch(clearAuthMessage());
    dispatch(signIn(formData));
  }

  return (
    <div>
      <h1>Sign In Page</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type = "text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type = "password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {error && <p>{error}</p>}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default SignInPage;


