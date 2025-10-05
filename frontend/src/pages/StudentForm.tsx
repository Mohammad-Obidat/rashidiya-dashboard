import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type { Student, CreateStudentDto, UpdateStudentDto } from '../types/program';
import { Gender } from '../types/program';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Save, ArrowRight, UserPlus, Edit } from 'lucide-react';
import { gradeOptions, sectionOptions, getAllGenders } from '../config/programConfig';

const StudentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CreateStudentDto | UpdateStudentDto>({
    name: '',
    studentNumber: '',
    grade: '',
    section: '',
    gender: Gender.MALE,
    birthDate: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const genderOptions = getAllGenders();

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const student = await api.students.get(id);
          setFormData({
            name: student.name,
            studentNumber: student.studentNumber,
            grade: student.grade,
            section: student.section,
            gender: student.gender || Gender.MALE,
            birthDate: student.birthDate ? new Date(student.birthDate).toISOString().split('T')[0] : '',
            phone: student.phone || '',
            address: student.address || '',
          });
        } catch (err) {
          setError('فشل في تحميل بيانات الطالب');
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        await api.students.update(id, formData as UpdateStudentDto);
      } else {
        await api.students.create(formData as CreateStudentDto);
      }
      navigate('/students');
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل في حفظ الطالب');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">جاري التحميل...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={() => navigate('/students')} variant="secondary" className="h-10 w-10 p-0 flex items-center justify-center">
          <ArrowRight size={20} />
        </Button>
        <h2 className="text-3xl font-bold text-gray-800">
          {isEditMode ? <Edit className="inline-block ml-2"/> : <UserPlus className="inline-block ml-2"/>} 
          {isEditMode ? 'تعديل بيانات طالب' : 'إضافة طالب جديد'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="name" label="الاسم الكامل" value={formData.name} onChange={handleChange} required />
          <Input name="studentNumber" label="الرقم الأكاديمي" value={formData.studentNumber} onChange={handleChange} required />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الصف</label>
            <select name="grade" value={formData.grade} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">اختر الصف</option>
              {gradeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الشعبة</label>
            <select name="section" value={formData.section} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">اختر الشعبة</option>
              {sectionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الجنس</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              {genderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <Input type="date" name="birthDate" label="تاريخ الميلاد" value={formData.birthDate || ''} onChange={handleChange} />
          <Input name="phone" label="رقم الهاتف" value={formData.phone || ''} onChange={handleChange} />
          <Input name="address" label="العنوان" value={formData.address || ''} onChange={handleChange} />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/students')} disabled={isSaving}>إلغاء</Button>
          <Button type="submit" variant="primary" disabled={isSaving} className="flex items-center gap-2">
            <Save size={18} />
            {isSaving ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
