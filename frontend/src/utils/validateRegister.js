const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Client-side validation aligned with backend UserCreate rules.
 * @param {{ name: string; email: string; password: string; confirmPassword: string }} fields
 * @returns {Record<string, string>}
 */
export function validateRegisterForm({ name, email, password, confirmPassword }) {
  const errors = {}
  const trimmedName = name.trim()
  const trimmedEmail = email.trim()

  if (!trimmedName) {
    errors.name = 'Name is required'
  }

  if (!trimmedEmail) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'Include at least one uppercase letter'
  } else if (!/[a-z]/.test(password)) {
    errors.password = 'Include at least one lowercase letter'
  } else if (!/\d/.test(password)) {
    errors.password = 'Include at least one number'
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}
