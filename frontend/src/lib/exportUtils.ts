import apiClient from './apiClient';

// ======================================================
// 🧾 Export Types
// ======================================================
export enum ExportFormat {
  XLSX = 'xlsx',
  PDF = 'pdf',
}

export enum DatasetType {
  STUDENTS = 'students',
  ATTENDANCE = 'attendance',
  PROGRAMS = 'programs',
  ADVISORS = 'advisors',
  SESSIONS = 'sessions',
}

export interface ExportOptions {
  format: ExportFormat;
  datasetType: DatasetType;
  filters?: Record<string, any>;
}

// ======================================================
// 🌐 Backend-based Export (Recommended)
// ======================================================

/**
 * Export data using backend API
 * This method sends the export request to the backend which generates
 * the file with proper Arabic support and RTL layout
 */
export const exportData = async (options: ExportOptions): Promise<void> => {
  try {
    const response = await apiClient.post(
      '/export',
      {
        format: options.format,
        datasetType: options.datasetType,
        filters: options.filters || {},
      },
      {
        responseType: 'blob',
      }
    );

    // Create download link
    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from Content-Disposition header or generate default
    const contentDisposition = response.headers['content-disposition'];
    let filename = `export_${options.datasetType}_${
      new Date().toISOString().split('T')[0]
    }.${options.format}`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error('Export failed:', error);
    throw new Error(error.response?.data?.message || 'فشل في تصدير البيانات');
  }
};

// ======================================================
// 📊 Legacy Client-side XLSX Export
// ======================================================

/**
 * @deprecated Use exportData() instead for better Arabic support
 * Legacy client-side XLSX export (kept for backward compatibility)
 */
export const exportToXLSX = async (
  datasetType: DatasetType,
  filters?: Record<string, any>
): Promise<void> => {
  return exportData({
    format: ExportFormat.XLSX,
    datasetType,
    filters,
  });
};

/**
 * @deprecated Use exportData() instead for proper Arabic support
 * PDF export using backend API
 */
export const exportToPDF = async (
  datasetType: DatasetType,
  filters?: Record<string, any>
): Promise<void> => {
  return exportData({
    format: ExportFormat.PDF,
    datasetType,
    filters,
  });
};
