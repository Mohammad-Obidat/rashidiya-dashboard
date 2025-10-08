import React from 'react';
import { Eye, Edit2, Trash2, Calendar, User, Users } from 'lucide-react';
import type { Program } from '../types/program';
import { getStatusConfig, getTypeConfig } from '../config/programConfig';

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

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className='group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1'>
      {/* Header Section with Gradient */}
      <div className={`${status.bg} p-5 border-b border-gray-100`}>
        <div className='flex items-start justify-between mb-3'>
          <h3 className='text-xl font-bold text-gray-900 line-clamp-1 flex-1'>
            {program.name}
          </h3>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.badge}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`}
            ></span>
            {status.label}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <span
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${type.color}`}
          >
            <span className='px-1'>{type.icon}</span>
            {type.label}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-5'>
        <p className='text-gray-600 mb-4 line-clamp-2 leading-relaxed min-h-[3rem]'>
          {program.description || 'لا يوجد وصف'}
        </p>

        {/* Info Grid */}
        <div className='space-y-2.5 mb-5 text-sm'>
          <div className='flex items-center gap-2 text-gray-600'>
            <Calendar className='w-4 h-4 text-blue-500 flex-shrink-0' />
            <span className='font-medium text-gray-700'>تاريخ الإنشاء:</span>
            <span className='truncate'>{formatDate(program.createdDate)}</span>
          </div>

          {program.currentAdvisor ? (
            <div className='flex items-center gap-2 text-gray-600'>
              <User className='w-4 h-4 text-green-500 flex-shrink-0' />
              <span className='font-medium text-gray-700'>المرشد:</span>
              <span className='truncate'>{program.currentAdvisor.name}</span>
            </div>
          ) : (
            <div className='flex items-center gap-2 text-gray-400'>
              <User className='w-4 h-4 flex-shrink-0' />
              <span className='font-medium'>المرشد:</span>
              <span className='text-xs'>غير محدد</span>
            </div>
          )}

          <div className='flex items-center gap-2 text-gray-600'>
            <Users className='w-4 h-4 text-purple-500 flex-shrink-0' />
            <span className='font-medium text-gray-700'>عدد الطلاب:</span>
            <span className='font-semibold text-purple-600'>
              {program.students?.length || 0}
            </span>
          </div>
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
          <button
            onClick={() => onEdit(program.id)}
            className='flex items-center justify-center gap-1 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-300 active:scale-95'
            aria-label='تعديل البرنامج'
          >
            <Edit2 className='w-4 h-4 cursor-pointer' />
          </button>
          <button
            onClick={() => onDelete(program.id)}
            className='flex items-center justify-center gap-1 px-3 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200 active:scale-95'
            aria-label='حذف البرنامج'
          >
            <Trash2 className='w-4 h-4 cursor-pointer' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
