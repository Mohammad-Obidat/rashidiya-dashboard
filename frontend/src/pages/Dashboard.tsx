import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type { Program } from '../types/program';
import { ProgramStatus, ProgramTypeEnum } from '../types/program';
import { getAllStatuses, getAllTypes } from '../config/programConfig';

// Components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SearchFilterBar from '../components/common/SearchFilterBar';
import ProgramsGrid from '../components/ProgramsGrid';
import EmptyState from '../components/EmptyState';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | ProgramTypeEnum>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ProgramStatus>(
    'all'
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get dropdown options
  const statusOptions = getAllStatuses();
  const typeOptions = getAllTypes();

  // Fetch programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.programs.list();
        setPrograms(data);
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل البرامج');
        console.error('Error fetching programs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || program.type === filterType;
    const matchesStatus =
      filterStatus === 'all' || program.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleView = (id: string) => navigate(`/program/${id}`);
  const handleEdit = (id: string) => navigate(`/program/edit/${id}`);

  const handleDeleteClick = (id: string) => {
    setProgramToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!programToDelete) return;

    try {
      setIsDeleting(true);
      await api.programs.remove(programToDelete);
      setPrograms(programs.filter((p) => p.id !== programToDelete));
      setDeleteModalOpen(false);
      setProgramToDelete(null);
    } catch (err: any) {
      console.error('Error deleting program:', err);
      alert('فشل في حذف البرنامج. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddProgram = () => navigate('/program/new');

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const hasActiveFilters =
    searchTerm || filterType !== 'all' || filterStatus !== 'all';

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='container mx-auto px-4 py-8'>
        <DashboardHeader
          programCount={programs.length}
          onAddProgram={handleAddProgram}
        />

        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onTypeChange={setFilterType}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          typeOptions={typeOptions}
          statusOptions={statusOptions}
          totalCount={programs.length}
          filteredCount={filteredPrograms.length}
          onResetFilters={handleResetFilters}
        />

        {filteredPrograms.length === 0 ? (
          <EmptyState
            isFiltered={hasActiveFilters}
            onAddProgram={handleAddProgram}
          />
        ) : (
          <ProgramsGrid
            programs={filteredPrograms}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          isDeleting={isDeleting}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
};

export default Dashboard;
