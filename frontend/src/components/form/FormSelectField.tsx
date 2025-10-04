import React from 'react';

interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface FormSelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
}

const FormSelectField: React.FC<FormSelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
}) => {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200'
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.icon && `${option.icon} `}
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelectField;
