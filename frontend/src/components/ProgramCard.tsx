import React from 'react';
import { Eye, Edit2, Trash2, Calendar, User, Users } from 'lucide-react';
import type { Program } from '../types/program';
import { getStatusConfig, getTypeConfig } from '../config/programConfig';
import { formatDate } from '../lib/dateUtils';
import Badge from './common/Badge';
import InfoRow from './common/InfoRow';
import IconButton from './common/IconButton';

interface ProgramCardProps {
  program: Program;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onView,
  onEdit,
  onDelete,
}) => {
  const status = getStatusConfig(program.status);
  const type = getTypeConfig(program.type);

  return (
    <div className='group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1'>
      {/* Header Section with Gradient */}
      <div className={`${status.bg} p-5 border-b border-gray-100`}>
        <div className='flex items-start justify-between mb-3'>
          <h3 className='text-xl font-bold text-gray-900 line-clamp-1 flex-1'>
            {program.name}
          </h3>
          <Badge
            label={status.label}
            colorClass={status.badge}
            dotClass={status.dot}
          />
        </div>

        <div className='flex items-center gap-2'>
          <Badge label={type.label} colorClass={type.color} icon={type.icon} />
        </div>
      </div>

      {/* Content Section */}
      <div className='p-5'>
        <p className='text-gray-600 mb-4 line-clamp-2 leading-relaxed min-h-[3rem]'>
          {program.description || 'لا يوجد وصف'}
        </p>

        {/* Info Grid */}
        <div className='space-y-2.5 mb-5 text-sm'>
          <InfoRow
            icon={<Calendar />}
            label='تاريخ الإنشاء'
            value={formatDate(program.createdDate)}
            iconClassName='w-4 h-4 text-blue-500 flex-shrink-0'
          />

          {program.currentAdvisor ? (
            <InfoRow
              icon={<User />}
              label='المرشد'
              value={program.currentAdvisor.name}
              iconClassName='w-4 h-4 text-green-500 flex-shrink-0'
            />
          ) : (
            <InfoRow
              icon={<User />}
              label='المرشد'
              value='غير محدد'
              valueClassName='text-xs'
              iconClassName='w-4 h-4 flex-shrink-0 text-gray-400'
              labelClassName='font-medium text-gray-400'
            />
          )}

          <InfoRow
            icon={<Users />}
            label='عدد الطلاب'
            value={program.students?.length || 0}
            valueClassName='font-semibold text-purple-600'
            iconClassName='w-4 h-4 text-purple-500 flex-shrink-0'
          />
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2'>
          <button
            onClick={() => onView(program.id)}
            className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 font-medium'
            aria-label='عرض البرنامج'
          >
            <Eye className='w-4 h-4' />
            <span>عرض</span>
          </button>
          <IconButton
            onClick={() => onEdit(program.id)}
            icon={<Edit2 />}
            label='تعديل البرنامج'
            variant='secondary'
          />
          <IconButton
            onClick={() => onDelete(program.id)}
            icon={<Trash2 />}
            label='حذف البرنامج'
            variant='danger'
          />
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
