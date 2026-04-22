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
        await dispatch(
          signIn({
            email: formData.email,
            password: formData.password,
          })
        ).unwrap();

        navigate('/products');
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
      <div>
        <h1>Update Password Success Page</h1>
        <p>We have sent the update password link to your email, please check that!</p>
      </div>
    );
  }

  const titleMap = {
    signin: 'Sign In Page',
    signup: 'Sign Up Page',
    updatePassword: 'Update your password',
  };

  const buttonTextMap = {
    signin: loading ? 'Signing In...' : 'Sign In',
    signup: loading ? 'Signing Up...' : 'Sign Up',
    updatePassword: loading ? 'Submitting...' : 'Update Password',
  };

  return (
    <div>
      <h1>{titleMap[mode]}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && <p>{formErrors.email}</p>}
        </div>

        {mode !== 'updatePassword' && (
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && <p>{formErrors.password}</p>}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {buttonTextMap[mode]}
        </button>
      </form>

      {error && <p>{error}</p>}
      {successMessage && mode !== 'updatePassword' && <p>{successMessage}</p>}

      {mode === 'signin' && (
        <div>
          <p>
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p>
            <Link to="/update-password">Forgot password?</Link>
          </p>
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
  );
}

export default AuthForm;