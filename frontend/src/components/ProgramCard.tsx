import React from 'react';
import { Eye, Edit2, Trash2, Calendar, User, Users } from 'lucide-react';
import type { IProgram } from '../types/program';

interface ProgramCardProps {
  program: IProgram;
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
  const statusConfig = {
    نشط: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-800 border border-green-200',
      dot: 'bg-green-500',
    },
    'غير نشط': {
      bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
      text: 'text-gray-700',
      badge: 'bg-gray-100 text-gray-800 border border-gray-200',
      dot: 'bg-gray-500',
    },
    مؤرشف: {
      bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      dot: 'bg-yellow-500',
    },
  };

  const typeColors = {
    رياضية: 'bg-blue-100 text-blue-800 border-blue-200',
    ثقافية: 'bg-purple-100 text-purple-800 border-purple-200',
    علمية: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    فنية: 'bg-pink-100 text-pink-800 border-pink-200',
    اجتماعية: 'bg-green-100 text-green-800 border-green-200',
    دينية: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    أخرى: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const config = statusConfig[program.status];

  return (
    <div className='group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1'>
      {/* Header Section with Gradient */}
      <div className={`${config.bg} p-5 border-b border-gray-100`}>
        <div className='flex items-start justify-between mb-3'>
          <h3 className='text-xl font-bold text-gray-900 line-clamp-1 flex-1'>
            {program.name}
          </h3>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}
            ></span>
            {program.status}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <span
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
              typeColors[program.type] || typeColors['أخرى']
            }`}
          >
            {program.type}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-5'>
        <p className='text-gray-600 mb-4 line-clamp-2 leading-relaxed min-h-[3rem]'>
          {program.description}
        </p>

        {/* Info Grid */}
        <div className='space-y-2.5 mb-5 text-sm'>
          <div className='flex items-center gap-2 text-gray-600'>
            <Calendar className='w-4 h-4 text-blue-500' />
            <span className='font-medium text-gray-700'>تاريخ الإنشاء:</span>
            <span>
              {new Date(program.createdDate).toLocaleDateString('ar-SA')}
            </span>
          </div>

          {program.currentAdvisor && (
            <div className='flex items-center gap-2 text-gray-600'>
              <User className='w-4 h-4 text-green-500' />
              <span className='font-medium text-gray-700'>المرشد:</span>
              <span>{program.currentAdvisor.name}</span>
            </div>
          )}

          {program.students && (
            <div className='flex items-center gap-2 text-gray-600'>
              <Users className='w-4 h-4 text-purple-500' />
              <span className='font-medium text-gray-700'>عدد الطلاب:</span>
              <span className='font-semibold text-purple-600'>
                {program.students.length}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2'>
          <button
            onClick={() => onView(program.id)}
            className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 font-medium cursor-pointer'
          >
            <Eye className='w-4 h-4' />
            <span>عرض</span>
          </button>
          <button
            onClick={() => onEdit(program.id)}
            className='flex items-center justify-center gap-1 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-300 active:scale-95 cursor-pointer'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => onDelete(program.id)}
            className='flex items-center justify-center gap-1 px-3 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200 active:scale-95 cursor-pointer'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
