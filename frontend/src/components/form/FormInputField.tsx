import React from 'react';

interface FormInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const FormInputField: React.FC<FormInputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
