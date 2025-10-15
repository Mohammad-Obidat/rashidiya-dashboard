import React, { useEffect, useState } from 'react';
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

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const statusOptions = getAllStatuses();
  const typeOptions = getAllTypes();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isOnline) {
        const timeSinceUpdate = Date.now() - lastUpdate.getTime();
        if (timeSinceUpdate > 2 * 60 * 1000) {
          setLastUpdate(new Date());
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isOnline, lastUpdate]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      {/* Offline Banner */}
      {!isOnline && (
        <div className='sticky top-0 z-40 bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium shadow-md'>
          <span className='inline-flex items-center gap-2'>
            <span className='w-2 h-2 bg-white rounded-full animate-pulse' />
            أنت غير متصل بالإنترنت - You are offline
          </span>
        </div>
      )}

      {/* Main Content Container */}
      <div className='container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl'>
        {/* Dashboard Header */}
        <div className='mb-4 sm:mb-6 lg:mb-8'>
          <DashboardHeader
            programCount={programs.length}
            onAddProgram={handleAddProgram}
          />
        </div>

        {/* Search and Filter Bar */}
        <div className='mb-4 sm:mb-6'>
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

          {/* Results Info Bar */}
          {hasActiveFilters && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 mt-3'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                <p className='text-xs sm:text-sm text-blue-800'>
                  <span className='font-semibold'>
                    {filteredPrograms.length}
                  </span>{' '}
                  من <span className='font-semibold'>{programs.length}</span>{' '}
                  برنامج
                </p>
                <button
                  onClick={resetFilters}
                  className='text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium underline self-start sm:self-auto'
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className='min-h-[400px]'>
          {filteredPrograms.length === 0 ? (
            <EmptyState
              isFiltered={hasActiveFilters}
              onAddProgram={handleAddProgram}
            />
          ) : (
            <div className='animate-fadeIn'>
              <ProgramsGrid
                programs={filteredPrograms}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </div>
          )}
        </div>

        {/* Last Update Info */}
        {isOnline && (
          <div className='mt-6 text-center text-xs text-gray-500'>
            آخر تحديث:{' '}
            {lastUpdate.toLocaleTimeString('ar-EG', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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
