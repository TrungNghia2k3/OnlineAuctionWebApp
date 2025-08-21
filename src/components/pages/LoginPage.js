import React, { useState } from 'react'
import { useAuth } from '@/hooks'
import { useNavigate } from 'react-router-dom'

/**
 * Login Page Component
 * Simplified version without PageLayout for faster loading
 */
const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Attempting login with:', { username: formData.username, password: '***' })
      
      const result = await login({
        username: formData.username,
        password: formData.password,
        rememberMe: formData.rememberMe
      })

      console.log('Login result:', result)

      if (result && result.success) {
        setSuccess('Login successful! Redirecting...')
        // Redirect to home page after successful login
        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else {
        setError(result?.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <h1 className="text-center mb-4">Login</h1>
                <p className="text-center text-muted mb-4">Please sign in to your account</p>
                
                {/* Display success message */}
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}

                {/* Display error message */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                  <div className="text-center">
                    <a href="/forgot-password" className="text-decoration-none">Forgot your password?</a>
                  </div>
                  <hr />
                  <div className="text-center">
                    <span className="text-muted">Don't have an account? </span>
                    <a href="/register" className="text-decoration-none">Sign up</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
