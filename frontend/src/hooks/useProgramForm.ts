import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgramTypeEnum, ProgramStatus } from '../types/program';
import type { CreateProgramDto, Program } from '../types/program';

interface UseProgramFormProps {
  initialProgram?: Program;
}

interface UseProgramFormResult {
  formData: CreateProgramDto;
  handleChange: (
    field: keyof CreateProgramDto,
    value: string | ProgramTypeEnum | ProgramStatus | undefined
  ) => void;
  errors: Partial<CreateProgramDto>;
  validateForm: () => boolean;
  isEditMode: boolean;
  id?: string;
  setFormData: React.Dispatch<React.SetStateAction<CreateProgramDto>>;
}

const useProgramForm = (props?: UseProgramFormProps): UseProgramFormResult => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CreateProgramDto>({
    name: '',
    type: ProgramTypeEnum.SCIENTIFIC,
    description: '',
    status: ProgramStatus.ACTIVE,
  });
  const [errors, setErrors] = useState<Partial<CreateProgramDto>>({});

  useEffect(() => {
    if (isEditMode && props?.initialProgram) {
      setFormData({
        name: props.initialProgram.name,
        type: props.initialProgram.type,
        description: props.initialProgram.description,
        status: props.initialProgram.status,
        currentAdvisorId: props.initialProgram.currentAdvisorId || undefined,
      });
    }
  }, [isEditMode, props?.initialProgram]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateProgramDto> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم البرنامج مطلوب';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف البرنامج مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof CreateProgramDto,
    value: string | ProgramTypeEnum | ProgramStatus | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    formData,
    handleChange,
    errors,
    validateForm,
    isEditMode,
    id,
    setFormData,
  };
};

export default useProgramForm;
