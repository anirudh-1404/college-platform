import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Mail, ArrowLeft, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import logoImg from '../../assets/logo.png'

const OtpVerificationScreen = ({
  email,
  purpose = 'login', // 'login' | 'register'
  onVerifySuccess,
  onBack,
  resendHandler,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [errorMsg, setErrorMsg] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState('')
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef([])

  // Countdown timer for resend
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  // Auto focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index, value) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, '')
    if (!cleaned && value !== '') return

    const newOtp = [...otp]
    newOtp[index] = cleaned.slice(-1)
    setOtp(newOtp)
    setErrorMsg('')

    // Move to next input if digit entered
    if (cleaned && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }

    // Auto submit if all 6 digits filled
    if (cleaned && index === 5) {
      const fullCode = newOtp.join('')
      if (fullCode.length === 6) {
        handleVerify(fullCode)
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length > 0) {
      const newOtp = [...otp]
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || ''
      }
      setOtp(newOtp)
      setErrorMsg('')

      const focusIdx = Math.min(pasted.length, 5)
      if (inputRefs.current[focusIdx]) {
        inputRefs.current[focusIdx].focus()
      }

      if (pasted.length === 6) {
        handleVerify(pasted)
      }
    }
  }

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || otp.join('')
    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.')
      return
    }

    setErrorMsg('')
    setResendSuccess('')
    setIsVerifying(true)
    try {
      await onVerifySuccess(code)
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired verification code.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0 || isResending) return
    setIsResending(true)
    setErrorMsg('')
    setResendSuccess('')
    try {
      if (resendHandler) {
        await resendHandler(email, purpose)
      }
      setResendSuccess('New verification code sent to your email.')
      setCountdown(60)
      setOtp(['', '', '', '', '', ''])
      if (inputRefs.current[0]) inputRefs.current[0].focus()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend code. Please wait a moment.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <img src={logoImg} alt="VidyaScope" className="h-12 w-auto object-contain" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
          Verify Your Identity
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          {purpose === 'register'
            ? 'We have sent a 6-digit confirmation code to complete your campus onboarding.'
            : 'Enter the 6-digit security code sent to verify your representative sign-in.'}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-6 sm:px-8 shadow-sm border border-border-color rounded-2xl">
          {/* Email badge pill */}
          <div className="mb-6 p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-4 w-4 text-brand-primary flex-shrink-0" />
              <span className="font-medium truncate text-text-primary">{email}</span>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-brand-primary font-bold hover:underline ml-2 flex-shrink-0 cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Resend Message */}
          {resendSuccess && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700 animate-in fade-in">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>{resendSuccess}</span>
            </div>
          )}

          {/* 6 Digit Input Group */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleVerify()
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-center text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                6-Digit Security Code
              </label>
              <div className="flex items-center justify-between gap-2 sm:gap-2.5" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-extrabold text-brand-primary bg-slate-50 border border-border-color rounded-xl focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isVerifying || otp.join('').length !== 6}
                className="btn btn-primary w-full py-2.5 text-xs font-bold justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>

              {/* Resend Code Strip */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to login</span>
                </button>

                <button
                  type="button"
                  disabled={countdown > 0 || isResending}
                  onClick={handleResend}
                  className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                    countdown > 0 || isResending
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-brand-primary hover:underline'
                  }`}
                >
                  <RefreshCw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
                  <span>
                    {isResending
                      ? 'Sending...'
                      : countdown > 0
                      ? `Resend in ${countdown}s`
                      : 'Resend Code'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default OtpVerificationScreen
