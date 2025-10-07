import apiClient from './apiClient';

/**
 * Export data to XLSX format
 * @param datasetType - Type of dataset to export (students, attendance, programs, advisors, sessions)
 * @param filters - Optional filters to apply
 * @param filename - Name of the downloaded file
 */
export const exportToXLSX = async (
  datasetType: string,
  filters?: Record<string, any>,
  filename: string = 'export.xlsx'
): Promise<void> => {
  try {
    const payload = {
      datasetType: datasetType.toLowerCase(), // تطابق مع Enum في backend
      format: 'xlsx', // lowercase كما هو متوقع
      filters: filters || {}, // ضمان إرسال object فارغ إذا لم يوجد
    };

    console.log('Sending XLSX export request:', payload);

    const response = await apiClient.post('/export', payload, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error(
      'Error exporting to XLSX:',
      error.response?.data || error.message
    );
    throw new Error('فشل في تصدير الملف إلى XLSX');
  }
};

/**
 * Export data to PDF format
 * @param datasetType - Type of dataset to export (students, attendance, programs, advisors, sessions)
 * @param filters - Optional filters to apply
 * @param filename - Name of the downloaded file
 */
export const exportToPDF = async (
  datasetType: string,
  filters?: Record<string, any>,
  filename: string = 'export.pdf'
): Promise<void> => {
  try {
    const payload = {
      datasetType: datasetType.toLowerCase(), // تطابق مع Enum في backend
      format: 'pdf', // lowercase كما هو متوقع
      filters: filters || {}, // ضمان إرسال object فارغ إذا لم يوجد
    };

    console.log('Sending PDF export request:', payload);

    const response = await apiClient.post('/export', payload, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error(
      'Error exporting to PDF:',
      error.response?.data || error.message
    );
    throw new Error('فشل في تصدير الملف إلى PDF');
  }
};
