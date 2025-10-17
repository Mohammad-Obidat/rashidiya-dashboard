import React from 'react';

interface BadgeProps {
  label: string;
  colorClass: string;
  dotClass?: string;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ label, colorClass, dotClass, icon }) => {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
    >
      {dotClass && (
        <span
          className={`w-2 h-2 rounded-full ${dotClass} animate-pulse`}
        ></span>
      )}
      {icon && <span className="px-1">{icon}</span>}
      {label}
    </div>
  );
};

export default Badge;
