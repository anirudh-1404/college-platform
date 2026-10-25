import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Mail, Lock, User, Briefcase, Phone, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import logoImg from '../../assets/logo.png'
import { FormField, TextInput } from '../../components/common/FormControls'
import { DocumentUploader } from '../../components/common/FileUpload'
import { authService } from '../../data/authService'
import OtpVerificationScreen from './OtpVerificationScreen'

const CollegeRegisterPage = ({ onNavigateLogin, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    collegeName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactPerson: '',
    designation: '',
    phone: '',
    proofFile: null,
  })

  const [step, setStep] = useState('form') // 'form' | 'otp'
  const [pendingEmail, setPendingEmail] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!formData.collegeName.trim()) errs.collegeName = 'College name is required.'
    if (!formData.email.trim()) {
      errs.email = 'Official college email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid official email address.'
    }
    if (!formData.password) {
      errs.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.'
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.'
    }
    if (!formData.contactPerson.trim()) {
      errs.contactPerson = 'Authorized contact person name is required.'
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Official contact phone number is required.'
    }
    if (!formData.proofFile) {
      errs.proofFile = 'Please upload official registration proof or university affiliation document (PDF/Image).'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await authService.registerCollege(formData)
      if (res.requireOtp) {
        setPendingEmail(res.email || formData.email)
        setStep('otp')
      } else if (res.success) {
        onRegistrationSuccess(res.user)
      }
    } catch (err) {
      console.error('Registration error:', err)
      setSubmitError(err.message || 'Registration failed. Please check your details and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (code) => {
    const res = await authService.verifyRegisterOtp({
      email: pendingEmail || formData.email,
      otp: code,
    })
    if (res.success) {
      onRegistrationSuccess(res.user)
    }
  }

  if (step === 'otp') {
    return (
      <OtpVerificationScreen
        email={pendingEmail || formData.email}
        purpose="register"
        onVerifySuccess={handleVerifyOtp}
        onBack={() => setStep('form')}
        resendHandler={(email, purpose) => authService.resendOtp({ email, purpose })}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-3">
        <div className="flex justify-center">
          <img src={logoImg} alt="VidyaScope" className="h-12 w-auto object-contain" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
          Register Your Higher Education Institution
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto">
          Create your verified VidyaScope institutional account. Showcase dynamic academic programs, accurate fee structures, verified placement records, and campus facilities.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-6 sm:px-10 border border-border-color rounded-2xl shadow-card space-y-6"
        >
          <div className="p-3.5 bg-brand-accent/50 border border-brand-primary/20 rounded-xl flex items-start gap-3 text-xs text-brand-primary">
            <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Verification Process Notice: </strong>
              <span className="text-text-secondary">
                To maintain authentic and verified data for students, all registrations undergo verification by the VidyaScope Administrative Board before full dashboard access is granted.
              </span>
            </div>
          </div>

          {submitError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Institution Details */}
            <div className="space-y-4">
              <h2 className="font-serif text-sm font-bold text-text-primary border-b border-border-color pb-2">
                1. Institutional Information
              </h2>

              <FormField
                label="Full College / University Name"
                required
                error={errors.collegeName}
                helperText="Enter the official registered name of your institute or university."
              >
                <TextInput
                  placeholder="e.g. Indian Institute of Technology Bombay"
                  icon={Building2}
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Official Institutional Email"
                  required
                  error={errors.email}
                  helperText="Use your official domain email (e.g. registrar@college.edu.in)."
                >
                  <TextInput
                    type="email"
                    placeholder="registrar@institution.edu.in"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormField>

                <FormField
                  label="Official Contact Number"
                  required
                  error={errors.phone}
                >
                  <TextInput
                    placeholder="+91-9876543210"
                    icon={Phone}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </FormField>
              </div>
            </div>

            {/* Section 2: Authorized Representative */}
            <div className="space-y-4 pt-2">
              <h2 className="font-serif text-sm font-bold text-text-primary border-b border-border-color pb-2">
                2. Authorized Representative
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Contact Person Name"
                  required
                  error={errors.contactPerson}
                >
                  <TextInput
                    placeholder="Dr. S. K. Sharma"
                    icon={User}
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </FormField>

                <FormField
                  label="Designation / Role"
                  optional
                >
                  <TextInput
                    placeholder="Dean / Principal / Director"
                    icon={Briefcase}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Account Password"
                  required
                  error={errors.password}
                >
                  <TextInput
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </FormField>

                <FormField
                  label="Confirm Password"
                  required
                  error={errors.confirmPassword}
                >
                  <TextInput
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </FormField>
              </div>
            </div>

            {/* Section 3: Verification Proof Upload */}
            <div className="space-y-4 pt-2">
              <h2 className="font-serif text-sm font-bold text-text-primary border-b border-border-color pb-2">
                3. Institutional Verification Proof
              </h2>

              <DocumentUploader
                fileData={formData.proofFile}
                onChange={(file) => {
                  setFormData({ ...formData, proofFile: file })
                  if (errors.proofFile) setErrors({ ...errors, proofFile: null })
                }}
                onRemove={() => setFormData({ ...formData, proofFile: null })}
                error={errors.proofFile}
                label="Upload Accreditation Order / Recognition Gazette / University Affiliation (PDF or Image)"
                description="Upload official state recognition document, AICTE / UGC approval certificate, or affiliation letter with registrar signature & stamp."
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-border-color space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg w-full cursor-pointer text-xs sm:text-sm font-bold shadow-sm"
              >
                {isSubmitting ? (
                  <span>Registering Institution...</span>
                ) : (
                  <>
                    <span>Submit Institutional Registration</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center text-xs text-text-secondary">
                Already have a registered account?{' '}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="font-bold text-brand-primary hover:underline cursor-pointer"
                >
                  Sign In to College Portal
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CollegeRegisterPage
