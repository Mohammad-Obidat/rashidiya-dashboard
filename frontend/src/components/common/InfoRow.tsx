import React, { type ReactElement } from 'react';

interface InfoRowProps {
  icon: ReactElement<{ className?: string }>;
  label: string;
  value: string | React.ReactNode;
  valueClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  valueClassName = 'truncate',
  labelClassName = 'font-medium text-gray-700',
  iconClassName = 'w-4 h-4 text-blue-500 flex-shrink-0',
}) => {
  return (
    <div className='flex items-center gap-2 text-gray-600'>
      {React.cloneElement(icon, {
        className: `${icon.props.className || ''} ${iconClassName}`,
      })}
      <span className={labelClassName}>{label}:</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
};

export default InfoRow;
