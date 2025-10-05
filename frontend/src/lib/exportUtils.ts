import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import amiriFont from './font/amiriFontBase64';
import ArabicReshaper from 'arabic-reshaper';
import bidi from 'bidi-js';

// ======================================================
// 🧾 XLSX Export
// ======================================================
export const exportToXLSX = (
  data: any[],
  fileName: string,
  sheetName: string
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// ======================================================
// 📄 PDF Export (Arabic + RTL support)
// ======================================================

// 1️⃣ Register Amiri font for jsPDF
(jsPDF as any).API.events.push([
  'addFonts',
  function () {
    this.addFileToVFS('Amiri-Regular.ttf', amiriFont);
    this.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
  },
]);

// 2️⃣ Helper to prepare Arabic text properly (reshaping + bidi)
const prepareArabic = (text: string) => {
  if (typeof text !== 'string') return text;
  const reshaped = ArabicReshaper.reshape(text); // تشكيل الحروف العربية
  const bidiText = bidi
    .getEmbeddingLevels(reshaped)
    .map((x) => x.char)
    .join(''); // RTL
  return bidiText;
};

// 3️⃣ Export to PDF using jsPDF + autoTable
export const exportToPDF = (
  headers: string[],
  body: any[][],
  title: string
) => {
  const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

  doc.setFont('Amiri');
  doc.setFontSize(12);

  // Optional title (RTL, correctly shaped)
  doc.text(prepareArabic(title), doc.internal.pageSize.getWidth() - 40, 40, {
    align: 'right',
  });

  // Prepare Arabic-friendly table data
  const rtlHeaders = headers.map(prepareArabic);
  const rtlBody = body.map((row) => row.map(prepareArabic));

  autoTable(doc, {
    head: [rtlHeaders],
    body: rtlBody,
    styles: {
      font: 'Amiri',
      halign: 'right',
      valign: 'middle',
      fontStyle: 'normal',
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      halign: 'right',
    },
    margin: { top: 60, right: 40, left: 40 },
  });

  doc.save(`${title}.pdf`);
};
