import React, { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'

// 1. FormField Wrapper
export const FormField = ({
  label,
  required = false,
  optional = false,
  helperText,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-text-primary">
            {label}
            {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </label>
          {optional && (
            <span className="text-[11px] text-text-light font-normal">Optional</span>
          )}
        </div>
      )}

      {children}

      {error ? (
        <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-text-light leading-relaxed">{helperText}</p>
      ) : null}
    </div>
  )
}

// 2. Standard Text Input
export const TextInput = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  icon: Icon,
  prefix,
  suffix,
  addonRight,
  className = '',
  ...props
}) => {
  return (
    <div className={`relative flex items-center ${addonRight ? 'rounded-lg border border-border-color focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary bg-white' : ''}`}>
      {Icon && (
        <div className="absolute left-3 text-text-light pointer-events-none z-10">
          <Icon className="h-4 w-4" />
        </div>
      )}
      {prefix && (
        <span className="absolute left-3 text-xs font-medium text-text-light pointer-events-none z-10">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled || readOnly}
        readOnly={readOnly}
        className={`w-full text-xs font-medium text-text-primary bg-white ${
          addonRight ? 'border-0 rounded-l-lg' : 'border border-border-color rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary'
        } py-2.5 px-3 focus:outline-none transition-colors disabled:bg-slate-50 disabled:text-text-light disabled:cursor-not-allowed ${
          Icon ? 'pl-9' : prefix ? 'pl-8' : ''
        } ${suffix ? 'pr-12' : ''} ${className}`}
        {...props}
      />
      {suffix && (
        <span className="absolute right-3 text-xs font-medium text-text-light pointer-events-none">
          {suffix}
        </span>
      )}
      {addonRight && (
        <div className="border-l border-border-color bg-slate-50/80 px-3 py-2 text-xs font-semibold text-text-secondary rounded-r-lg flex-shrink-0 select-none">
          {addonRight}
        </div>
      )}
    </div>
  )
}

// 3. Textarea Input
export const Textarea = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  readOnly = false,
  maxLength,
  className = '',
  ...props
}) => {
  const currentLength = (value || '').length
  return (
    <div className="space-y-1">
      <textarea
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled || readOnly}
        readOnly={readOnly}
        maxLength={maxLength}
        className={`w-full text-xs font-medium text-text-primary bg-white border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors disabled:bg-slate-50 disabled:text-text-light disabled:cursor-not-allowed resize-y ${className}`}
        {...props}
      />
      {maxLength && (
        <div className="flex justify-end">
          <span className="text-[10px] text-text-light">
            {currentLength} / {maxLength} characters
          </span>
        </div>
      )}
    </div>
  )
}

// 4. Select Dropdown Input
export const SelectInput = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <select
      value={value ?? ''}
      onChange={onChange}
      disabled={disabled}
      className={`w-full text-xs font-medium text-text-primary bg-white border border-border-color rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors disabled:bg-slate-50 disabled:text-text-light disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => {
        const val = typeof opt === 'object' ? opt.value : opt
        const lbl = typeof opt === 'object' ? opt.label : opt
        return (
          <option key={val} value={val}>
            {lbl}
          </option>
        )
      })}
    </select>
  )
}

// 5. Dynamic Tag Input (For Specializations, Accepted Exams, Recruiters)
export const TagInput = ({
  tags = [],
  onChange,
  placeholder = 'Type and press Enter...',
  disabled = false,
  readOnly = false,
  maxTags = 20,
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const trimmed = inputValue.trim().replace(/^,|,$/g, '')
    if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
      const updated = [...tags, trimmed]
      onChange(updated)
      setInputValue('')
    }
  }

  const removeTag = (indexToRemove) => {
    if (disabled || readOnly) return
    const updated = tags.filter((_, idx) => idx !== indexToRemove)
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5 min-h-[38px] p-1.5 bg-white border border-border-color rounded-lg focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary transition-colors">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-brand-primary border border-purple-100 text-xs font-semibold"
          >
            <span>{tag}</span>
            {!disabled && !readOnly && (
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="text-brand-primary hover:text-rose-600 transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}

        {!disabled && !readOnly && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={tags.length === 0 ? placeholder : 'Add more...'}
            className="flex-1 min-w-[120px] text-xs font-medium text-text-primary px-2 py-1 focus:outline-none bg-transparent"
          />
        )}
      </div>
      <p className="text-[10px] text-text-light">
        Press <kbd className="px-1 py-0.5 bg-slate-100 border rounded text-[10px]">Enter</kbd> or comma to add tag. ({tags.length}/{maxTags})
      </p>
    </div>
  )
}

// 6. Section Card Wrapper (Clean SaaS aesthetic)
export const SectionCard = ({
  title,
  description,
  badge,
  action,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-border-color rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs ${className}`}>
      {(title || description || action || badge) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border-color">
          <div>
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="font-serif text-base font-bold text-text-primary">
                  {title}
                </h3>
              )}
              {badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && <div className="self-start sm:self-auto">{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  )
}

// 7. Toggle Switch Input
export const ToggleSwitch = ({ checked, onChange, label, description, disabled = false }) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <div className="relative inline-flex items-center mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
      </div>
      {(label || description) && (
        <div>
          {label && <p className="text-xs font-semibold text-text-primary">{label}</p>}
          {description && <p className="text-[11px] text-text-light">{description}</p>}
        </div>
      )}
    </label>
  )
}
