export function validateEmail(email) {
  if (!email.trim()) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return 'Invalid email input!';
  }

  return '';
}

export function validatePassword(password) {
  if (!password.trim()) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return '';
}

export function validateAuthForm(mode, formData) {
  const errors = {};

  const emailError = validateEmail(formData.email || '');
  if (emailError) {
    errors.email = emailError;
  }

  if (mode !== 'updatePassword') {
    const passwordError = validatePassword(formData.password || '');
    if (passwordError) {
      errors.password = passwordError;
    }
  }

  return errors;
}