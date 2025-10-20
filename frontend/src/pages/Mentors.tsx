import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/apiClient';
import type { Advisor, Program } from '../types/program';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import AssignAdvisorModal from '../components/modals/AssignAdvisorModal';
import {
  PlusCircle,
  Search,
  FileDown,
  Trash2,
  Edit,
  UserPlus,
  MoreVertical,
} from 'lucide-react';
import { exportToXLSX, exportToPDF } from '../lib/exportUtils';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../contexts/ToastContext';

const Mentors: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { i18n, t } = useTranslation();
  const [mentors, setMentors] = useState<Advisor[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const isRTL = i18n.language === 'ar' || i18n.language === 'he';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [mentorsData, programsData] = await Promise.all([
          api.advisors.list(),
          api.programs.list(),
        ]);
        setMentors(mentorsData);
        setPrograms(programsData);
      } catch (err: any) {
        setError(err.message || t('dashboard_error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const filteredMentors = useMemo(
    () =>
      mentors.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.phone.includes(searchTerm)
      ),
    [mentors, searchTerm]
  );

  const handleDeleteClick = (id: string) => {
    setMentorToDelete(id);
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!mentorToDelete) return;
    setIsDeleting(true);
    try {
      await api.advisors.remove(mentorToDelete);
      setMentors(mentors.filter((m) => m.id !== mentorToDelete));
      setDeleteModalOpen(false);
      setMentorToDelete(null);
      toast.success(t('mentor_deleted_success'));
    } catch (err: any) {
      toast.error(t('mentor_delete_failed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignClick = (advisorId: string) => {
    setSelectedAdvisor(advisorId);
    setAssignModalOpen(true);
    setOpenMenuId(null);
  };

  const handleAssign = async (programId: string) => {
    if (!selectedAdvisor) return;

    try {
      // Create advisor assignment
      await api.advisorAssignments.create({
        advisorId: selectedAdvisor,
        programId: programId,
        assignedDate: new Date().toISOString(),
      });

      // Update program's currentAdvisorId
      await api.programs.update(programId, {
        currentAdvisorId: selectedAdvisor,
      });

      toast.success(t('mentor_assigned_success'));
      setSelectedAdvisor(null);
    } catch (err: any) {
      toast.error(t('mentor_assign_failed'));
      throw err;
    }
  };

  const handleExportXLSX = async () => {
    try {
      await exportToXLSX('ADVISORS', {}, 'قائمة_المشرفين.xlsx');
      toast.success(t('export_success'));
    } catch (err: any) {
      toast.error(t('export_failed'));
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF('ADVISORS', {}, 'قائمة_المشرفين.pdf');
      toast.success(t('export_success'));
    } catch (err: any) {
      toast.error(t('export_failed'));
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {t('mentors_list_title')}
        </h2>
        <Button
          onClick={() => navigate('/mentors/new')}
          variant="primary"
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <PlusCircle size={18} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">{t('add_new_mentor')}</span>
        </Button>
      </div>

      {/* Search and Export Section */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6 space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_mentors_placeholder')}
            className="pl-10 text-sm sm:text-base"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportXLSX}
            variant="secondary"
            className="flex items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
          >
            <FileDown size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">
              {t('export_xlsx').split(' ')[0]}
            </span>{' '}
            XLSX
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="secondary"
            className="flex items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
          >
            <FileDown size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">
              {t('export_pdf').split(' ')[0]}
            </span>{' '}
            PDF
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-center">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="p-3 lg:p-4">{t('mentor_name')}</th>
              <th className="p-3 lg:p-4">{t('mentor_email')}</th>
              <th className="p-3 lg:p-4">{t('mentor_phone')}</th>
              <th className="p-3 lg:p-4 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredMentors.map((mentor) => (
              <tr
                key={mentor.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3 lg:p-4 font-medium">{mentor.name}</td>
                <td className="p-3 lg:p-4">{mentor.email}</td>
                <td className="p-3 lg:p-4">{mentor.phone}</td>
                <td className="p-3 lg:p-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={() => handleAssignClick(mentor.id)}
                      variant="primary"
                      className="h-8 w-8 p-0 flex items-center justify-center"
                      title={t('assign_to_program')}
                    >
                      <UserPlus size={16} />
                    </Button>
                    <Button
                      onClick={() => navigate(`/mentors/edit/${mentor.id}`)}
                      variant="secondary"
                      className="h-8 w-8 p-0 flex items-center justify-center"
                      title={t('edit_button')}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(mentor.id)}
                      variant="danger"
                      className="h-8 w-8 p-0 flex items-center justify-center"
                      title={t('delete_button')}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMentors.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            {t('no_mentors_found')}
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-lg shadow-sm p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-gray-800 truncate">
                  {mentor.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 break-all">
                  {mentor.email}
                </p>
                <p className="text-sm text-gray-600 mt-1">{mentor.phone}</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => toggleMenu(mentor.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
                {openMenuId === mentor.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div
                      className={`absolute  ${
                        isRTL ? 'left-0' : 'right-0'
                      } mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20`}
                    >
                      <button
                        onClick={() => handleAssignClick(mentor.id)}
                        className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <UserPlus size={16} />
                        {t('assign_to_program')}
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/mentors/edit/${mentor.id}`);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit size={16} />
                        {t('edit_button')}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(mentor.id)}
                        className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        {t('delete_button')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredMentors.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            {t('no_mentors_found')}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('delete_mentor_title')}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
              className="text-sm sm:text-base"
            >
              {t('cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="text-sm sm:text-base"
            >
              {isDeleting ? t('deleting') : t('delete_button')}
            </Button>
          </>
        }
      >
        <p className="text-sm sm:text-base">{t('delete_mentor_message')}</p>
      </Modal>

      {/* Assign Advisor Modal */}
      <AssignAdvisorModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onAssign={handleAssign}
        programs={programs}
      />
    </div>
  );
};

export default Mentors;
