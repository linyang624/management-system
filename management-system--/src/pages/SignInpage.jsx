import { useState } from 'react';

function SignInPage() {
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

  return (
    <div>
      <h1>Sign In Page</h1>
      
      <div>
        <label>Email</label>
        <input 
          name="email" 
          value={formData.email} 
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Password</label>
        <input 
          name="password" 
          value={formData.password} 
          onChange={handleChange}
        />
      </div>

      <p>Email: {formData.email}</p>
      <p>Password: {formData.password}</p>
    </div>
  );
}

export default SignInPage;


