import React, { type ReactElement } from 'react';

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactElement<{ className?: string }>;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onClick,
  className,
  variant = 'secondary',
  ...props
}) => {
  const baseStyles =
    'flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg transition-all duration-200 active:scale-95';
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md',
    secondary:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className || ''}`}
      aria-label={label}
      {...props}
    >
      {React.cloneElement(icon, {
        className: `${icon.props.className || ''} w-4 h-4`,
      })}
    </button>
  );
};

export default IconButton;
