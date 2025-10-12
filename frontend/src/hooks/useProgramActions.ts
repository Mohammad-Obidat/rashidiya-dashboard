import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type { Program } from '../types/program';

interface UseProgramActionsResult {
  handleView: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDeleteClick: (id: string) => void;
  handleDeleteConfirm: () => Promise<void>;
  handleAddProgram: () => void;
  deleteModalOpen: boolean;
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleting: boolean;
}

const useProgramActions = (
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>
): UseProgramActionsResult => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = (id: string) => navigate(`/programs/${id}`);
  const handleEdit = (id: string) => navigate(`/programs/edit/${id}`);
  const handleAddProgram = () => navigate('/programs/new');

  const handleDeleteClick = (id: string) => {
    setProgramToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!programToDelete) return;

    try {
      setIsDeleting(true);
      await api.programs.remove(programToDelete);
      setPrograms((prevPrograms) =>
        prevPrograms.filter((p) => p.id !== programToDelete)
      );
      setDeleteModalOpen(false);
      setProgramToDelete(null);
    } catch (err: any) {
      console.error('Error deleting program:', err);
      alert('فشل في حذف البرنامج. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleView,
    handleEdit,
    handleDeleteClick,
    handleDeleteConfirm,
    handleAddProgram,
    deleteModalOpen,
    setDeleteModalOpen,
    isDeleting,
  };
};

export default useProgramActions;
