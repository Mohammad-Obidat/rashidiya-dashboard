import React from 'react';
import { getAllStatuses, getAllTypes } from '../config/programConfig';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SearchFilterBar from '../components/common/SearchFilterBar';
import ProgramsGrid from '../components/ProgramsGrid';
import EmptyState from '../components/EmptyState';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import usePrograms from '../hooks/usePrograms';
import useProgramFiltering from '../hooks/useProgramFiltering';
import useProgramActions from '../hooks/useProgramActions';

const Dashboard: React.FC = () => {
  const { programs, loading, error, setPrograms } = usePrograms();
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filteredPrograms,
    hasActiveFilters,
    resetFilters,
  } = useProgramFiltering(programs);
  const {
    handleView,
    handleEdit,
    handleDeleteClick,
    handleDeleteConfirm,
    handleAddProgram,
    deleteModalOpen,
    setDeleteModalOpen,
    isDeleting,
  } = useProgramActions(setPrograms);

  const statusOptions = getAllStatuses();
  const typeOptions = getAllTypes();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
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
        onResetFilters={resetFilters}
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
    </>
  );
};

export default Dashboard;
