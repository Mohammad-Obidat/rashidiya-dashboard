import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type { CreateProgramDto } from '../types/program';
import { useToast } from '../contexts/ToastContext';

interface UseProgramSubmissionProps {
  formData: CreateProgramDto;
  selectedAdvisorId: string;
  selectedStudentIds: string[];
  isEditMode: boolean;
  programId?: string;
}

interface UseProgramSubmissionResult {
  isSubmitting: boolean;
  submitProgram: () => Promise<void>;
  submissionError: string | null;
}

const useProgramSubmission = ({
  formData,
  selectedAdvisorId,
  selectedStudentIds,
  isEditMode,
  programId,
}: UseProgramSubmissionProps): UseProgramSubmissionResult => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const submitProgram = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const programDto = {
        ...formData,
        currentAdvisorId: selectedAdvisorId || undefined,
      };

      let newProgramId: string;

      if (isEditMode && programId) {
        await api.programs.update(programId, programDto);
        newProgramId = programId;

        const currentEnrollments = await api.studentPrograms.byProgram(
          programId
        );
        const currentStudentIds = currentEnrollments.map((sp) => sp.studentId);

        const studentsToRemove = currentStudentIds.filter(
          (sid) => !selectedStudentIds.includes(sid)
        );
        for (const studentId of studentsToRemove) {
          const enrollment = currentEnrollments.find(
            (sp) => sp.studentId === studentId
          );
          if (enrollment) {
            await api.studentPrograms.remove(enrollment.id);
          }
        }

        const studentsToAdd = selectedStudentIds.filter(
          (sid) => !currentStudentIds.includes(sid)
        );
        for (const studentId of studentsToAdd) {
          await api.studentPrograms.create({
            studentId,
            programId: programId,
            joinDate: new Date().toISOString(),
          });
        }
      } else {
        const newProgram = await api.programs.create(programDto);
        newProgramId = newProgram.id;

        for (const studentId of selectedStudentIds) {
          await api.studentPrograms.create({
            studentId,
            programId: newProgram.id,
            joinDate: new Date().toISOString(),
          });
        }
      }

      if (isEditMode) {
        toast.success('تم تحديث البرنامج بنجاح');
      } else {
        toast.success('تم إضافة البرنامج بنجاح');
      }
      navigate(`/programs/${newProgramId}`);
    } catch (err: any) {
      console.error('Failed to save program:', err);
      const errorMsg = 'فشل في حفظ البرنامج. يرجى المحاولة مرة أخرى.';
      setSubmissionError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitProgram,
    submissionError,
  };
};

export default useProgramSubmission;
