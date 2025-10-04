import React from 'react';

interface FormTextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  showCharCount?: boolean;
}

const FormTextAreaField: React.FC<FormTextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  rows = 4,
  showCharCount = true,
}) => {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
          error
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
        placeholder={placeholder}
        disabled={disabled}
      />
      <div className='flex justify-between items-center mt-1'>
        {error ? (
          <p className='text-sm text-red-600'>{error}</p>
        ) : showCharCount ? (
          <p className='text-sm text-gray-500'>{value.length} حرف</p>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default FormTextAreaField;
