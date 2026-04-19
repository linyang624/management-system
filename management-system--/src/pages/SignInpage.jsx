import { useState } from 'react';

function SignInPage() {
  const [formData, setFormData] = useState ({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      const response = await fetch('http://localhost:5001/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Sign in failed');
        return;
      }

      setSuccess(data.message || 'Sign in successful');
      console.log(data);
      // console.log('response:', response);
      // console.log('status:', response.status);
      // console.log('ok:', response.ok);
      //console.log('data:', data);
    } catch (err) {
      setError('Cannot connect to server');
    }
  };

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

        <button type="submit">Sign In</button>
      </form>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
}

export default SignInPage;


