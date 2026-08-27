import React, { useState } from 'react'
import { AlertCircle, Lock, Mail } from 'lucide-react'
import logoImg from '../../assets/logo.png'

const AdminLoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email and password.')
      return
    }

    setIsLoading(true)
    try {
      await onLoginSuccess(email, password)
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFillDemoAdmin = () => {
    setEmail('admin@vidyascope.com')
    setPassword('Admin@123')
    setErrorMsg('')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          src={logoImg}
          alt="VidyaScope Logo"
          className="mx-auto h-9 w-auto object-contain"
        />
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-slate-900">
          Admin Portal Login
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Sign in to manage college approvals and platform data
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xs border border-slate-200 rounded-xl">
          
          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vidyascope.com"
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2 px-4 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
            >
              Click to fill demo credentials (admin@vidyascope.com)
            </button>
          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 VidyaScope Platform. Admin Console.
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage
