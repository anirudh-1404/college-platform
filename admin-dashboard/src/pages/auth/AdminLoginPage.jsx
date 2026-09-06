import React, { useState } from 'react'
import { AlertCircle, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'
import logoImg from '../../assets/logo.png'

const AdminLoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email address and password.')
      return
    }

    setIsLoading(true)
    try {
      await onLoginSuccess(email.trim(), password)
    } catch (err) {
      setErrorMsg(
        err.message && !err.message.toLowerCase().includes('failed to fetch')
          ? err.message
          : 'Invalid email or password. Please verify your credentials.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/80 to-blue-50/30 text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-2">
          <img
            src={logoImg}
            alt="VidyaScope"
            className="h-10 w-auto object-contain"
          />
        </div>

        <h2 className="mt-3 text-center text-2xl font-extrabold tracking-tight text-slate-900">
          Admin Portal Login
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-500 font-medium">
          Authorized access for platform verification & management
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/40 border border-slate-200/80 rounded-2xl">
          
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vidyascope.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#033C8D]/15 focus:border-[#033C8D] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="block w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#033C8D]/15 focus:border-[#033C8D] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#033C8D] hover:bg-[#022B66] focus:outline-none focus:ring-2 focus:ring-[#033C8D]/20 disabled:opacity-50 cursor-pointer shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Institutional Security Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-[#033C8D]" />
            <span>Encrypted administrative session</span>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-400 font-medium">
          © 2026 VidyaScope Platform • Institutional Operations & Verification Console
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage
