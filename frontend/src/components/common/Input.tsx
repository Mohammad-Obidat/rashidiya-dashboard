import React from 'react';

interface InputProps {
  label?: string;
  name?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  error,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          {label}
          {required && <span className='text-red-500 mr-1'>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
          error
            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
      />
      {error && (
        <p className='mt-2 text-sm text-red-600 flex items-center gap-1'>
          <span className='inline-block w-1 h-1 bg-red-600 rounded-full'></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
