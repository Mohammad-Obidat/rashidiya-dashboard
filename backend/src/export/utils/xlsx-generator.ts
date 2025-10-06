import * as XLSX from 'xlsx';

export interface XLSXColumn {
  header: string;
  key: string;
  width?: number;
}

export interface XLSXGeneratorOptions {
  sheetName: string;
  columns: XLSXColumn[];
  data: any[];
  rtl?: boolean;
}

export class XLSXGenerator {
  /**
   * Generate XLSX file buffer from data
   * @param options - Configuration options for XLSX generation
   * @returns Buffer containing the XLSX file
   */
  static generate(options: XLSXGeneratorOptions): Buffer {
    const { sheetName, columns, data, rtl = true } = options;

    // Transform data to match column keys
    const transformedData = data.map((row) => {
      const transformedRow: any = {};
      columns.forEach((col) => {
        transformedRow[col.header] = row[col.key] ?? '';
      });
      return transformedRow;
    });

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // Set column widths
    const columnWidths = columns.map((col) => ({
      wch: col.width || 20,
    }));
    worksheet['!cols'] = columnWidths;

    // Set RTL if needed
    if (rtl) {
      if (!worksheet['!views']) {
        worksheet['!views'] = [{}];
      }
      worksheet['!views'][0].rightToLeft = true;
    }

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate buffer
    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true,
    });

    return buffer;
  }
}
