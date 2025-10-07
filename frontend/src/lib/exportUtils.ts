// import * as XLSX from 'xlsx';

// // ======================================================
// // 🧾 XLSX Export
// // ======================================================
// export const exportToXLSX = (
//   data: any[],
//   fileName: string,
//   sheetName: string
// ) => {
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
//   XLSX.writeFile(workbook, `${fileName}.xlsx`);
// };
