import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import logoImg from '../../assets/logo.png'
import { FormField, TextInput } from '../../components/common/FormControls'
import { authService } from '../../data/authService'

const CollegeLoginPage = ({ onNavigateRegister, onLoginSuccess, onStatusRedirect }) => {
  const [formData, setFormData] = useState({
    email: 'admin@iitb.ac.in',
    password: 'password123',
  })

  const [errors, setErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    const errs = {}
    if (!formData.email) errs.email = 'Email is required.'
    if (!formData.password) errs.password = 'Password is required.'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await authService.login(formData)
      if (res.success) {
        onLoginSuccess(res.user)
      } else {
        if (res.status === 'pending_verification' || res.status === 'rejected') {
          onStatusRedirect(res.status, res.user)
        } else {
          setErrorMessage(res.message || 'Login failed. Please check credentials.')
        }
      }
    } catch (err) {
      console.error(err)
      setErrorMessage('Network error during login.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <img src={logoImg} alt="VidyaScope" className="h-12 w-auto object-contain" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
          College Portal Login
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Access your institutional profile, manage dynamic courses & cutoffs, update placement figures, and review public listings.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-6 sm:px-8 border border-border-color rounded-2xl shadow-card space-y-5"
        >
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-border-color rounded-xl flex items-center justify-between text-xs">
            <span className="text-text-secondary">Demo Institutional Login:</span>
            <span className="font-mono text-brand-primary font-bold">admin@iitb.ac.in</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Official College Email" required error={errors.email}>
              <TextInput
                type="email"
                placeholder="registrar@institution.edu.in"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormField>

            <FormField label="Account Password" required error={errors.password}>
              <TextInput
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </FormField>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg w-full cursor-pointer text-xs sm:text-sm font-bold shadow-sm"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center text-xs text-text-secondary">
                New institution?{' '}
                <button
                  type="button"
                  onClick={onNavigateRegister}
                  className="font-bold text-brand-primary hover:underline cursor-pointer"
                >
                  Register Your College
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CollegeLoginPage
