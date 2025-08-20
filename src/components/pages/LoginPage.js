import React from 'react'
import {PageLayout} from '../templates'

/**
 * Login Page Component
 * Now uses PageLayout template for sequential loading
 */
const LoginPage = () => {
  return (
    <PageLayout 
      loadingMessage="Loading Login Page..."
      showFooter={false}
    >
      <div className="mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <h1 className="text-center mb-4">Login</h1>
                <p className="text-center text-muted mb-4">Please sign in to your account</p>
                
                <form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Enter your password" />
                  </div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="remember" />
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mb-3">Sign In</button>
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
    </PageLayout>
  )
}

export default LoginPage
