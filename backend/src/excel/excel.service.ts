import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {
  exportData<T>(
    data: T[],
    headers: { header: string; key: keyof T }[],
    sheetName: string,
  ): Buffer {
    const worksheetData = [
      headers.map((h) => h.header),
      ...data.map((row) => headers.map((h) => row[h.key] as unknown)),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }

  importData<T>(
    fileBuffer: Buffer,
    headers: { header: string; key: keyof T }[],
    sheetName: string,
  ): T[] {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw new Error(`Worksheet '${sheetName}' not found.`);
    }

    const rawRows = XLSX.utils.sheet_to_json<string[]>(worksheet, {
      header: 1,
    });

    if (rawRows.length === 0) return [];

    const columnHeaders = headers.map((h) => h.header);
    const columnKeys = headers.map((h) => h.key);

    const fileHeaders = rawRows[0];
    const headerIndexMap: Record<number, keyof T> = {};

    fileHeaders.forEach((fileHeader, colIndex) => {
      const matchIndex = columnHeaders.indexOf(fileHeader);
      if (matchIndex !== -1) {
        headerIndexMap[colIndex] = columnKeys[matchIndex];
      }
    });

    const data: T[] = [];

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i] as unknown[];
      const rowData: Partial<T> = {};

      Object.entries(headerIndexMap).forEach(([colIndex, key]) => {
        rowData[key] = row[Number(colIndex)] as T[keyof T];
      });

      data.push(rowData as T);
    }

    return data;
  }
}
