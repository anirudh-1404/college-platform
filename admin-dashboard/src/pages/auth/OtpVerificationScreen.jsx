import React, { useState, useEffect, useRef } from 'react'
import { ShieldCheck, Mail, ArrowLeft, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import logoImg from '../../assets/logo.png'

const OtpVerificationScreen = ({
  email,
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
    const cleaned = value.replace(/\D/g, '')
    if (!cleaned && value !== '') return

    const newOtp = [...otp]
    newOtp[index] = cleaned.slice(-1)
    setOtp(newOtp)
    setErrorMsg('')

    if (cleaned && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }

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
        await resendHandler(email)
      }
      setResendSuccess('New security code dispatched to your email.')
      setCountdown(60)
      setOtp(['', '', '', '', '', ''])
      if (inputRefs.current[0]) inputRefs.current[0].focus()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend code. Please try again in a moment.')
    } finally {
      setIsResending(false)
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
          Admin 2FA Security Check
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-500 font-medium">
          Enter the 6-digit one-time code to authorize administrative access
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/40 border border-slate-200/80 rounded-2xl">
          {/* Email badge pill */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-4 w-4 text-[#033C8D] flex-shrink-0" />
              <span className="font-semibold truncate text-slate-800">{email}</span>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-[#033C8D] font-bold hover:underline ml-2 flex-shrink-0 cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Resend Message */}
          {resendSuccess && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-emerald-600" />
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
              <label className="block text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Security Verification Code
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
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-extrabold text-[#033C8D] bg-slate-50 border border-slate-200/90 rounded-xl focus:bg-white focus:border-[#033C8D] focus:ring-2 focus:ring-[#033C8D]/20 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isVerifying || otp.join('').length !== 6}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#033C8D] hover:bg-[#022B66] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#033C8D] shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authorize Admin Sign-In</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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
                      : 'text-[#033C8D] hover:underline'
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
      </div>
    </div>
  )
}

export default OtpVerificationScreen
