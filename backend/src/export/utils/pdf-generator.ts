import PDFDocument from 'pdfkit';
import amiriFontBase64 from '../font/amiriFontBase64';

export interface PDFColumn {
  header: string;
  key: string;
  width?: number;
}

export interface PDFGeneratorOptions {
  title: string;
  columns: PDFColumn[];
  data: any[];
  rtl?: boolean;
}

export class PDFGenerator {
  /**
   * Generate PDF file buffer from data
   * @param options - Configuration options for PDF generation
   * @returns Promise<Buffer> containing the PDF file
   */
  static async generate(options: PDFGeneratorOptions): Promise<Buffer> {
    const { title, columns, data, rtl = true } = options;

    return new Promise((resolve, reject) => {
      try {
        // Create PDF document
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];

        // Collect data chunks
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Register Amiri font for Arabic support
        const fontBuffer = Buffer.from(amiriFontBase64, 'base64');
        doc.registerFont('Amiri', fontBuffer);
        doc.font('Amiri');

        // Add title
        doc.fontSize(18);
        doc.text(title, { align: rtl ? 'right' : 'left' });
        doc.moveDown();

        // Calculate column widths
        const pageWidth =
          doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const totalWidth = columns.reduce(
          (sum, col) => sum + (col.width || 1),
          0,
        );
        const columnWidths = columns.map(
          (col) => ((col.width || 1) / totalWidth) * pageWidth,
        );

        // Draw table header
        doc.fontSize(12);
        let currentX = rtl
          ? doc.page.width - doc.page.margins.right
          : doc.page.margins.left;
        const headerY = doc.y;

        columns.forEach((col, index) => {
          const colWidth = columnWidths[index];
          if (rtl) {
            currentX -= colWidth;
            doc.text(col.header, currentX, headerY, {
              width: colWidth,
              align: 'right',
            });
          } else {
            doc.text(col.header, currentX, headerY, {
              width: colWidth,
              align: 'left',
            });
            currentX += colWidth;
          }
        });

        doc.moveDown();

        // Draw horizontal line after header
        const lineY = doc.y;
        doc
          .moveTo(doc.page.margins.left, lineY)
          .lineTo(doc.page.width - doc.page.margins.right, lineY)
          .stroke();

        doc.moveDown(0.5);

        // Draw table rows
        doc.fontSize(10);
        data.forEach((row, rowIndex) => {
          const rowY = doc.y;

          // Check if we need a new page
          if (rowY > doc.page.height - doc.page.margins.bottom - 50) {
            doc.addPage();
            doc.font('Amiri');
            doc.fontSize(10);
          }

          currentX = rtl
            ? doc.page.width - doc.page.margins.right
            : doc.page.margins.left;

          columns.forEach((col, colIndex) => {
            const colWidth = columnWidths[colIndex];
            const cellValue = String(row[col.key] ?? '');

            if (rtl) {
              currentX -= colWidth;
              doc.text(cellValue, currentX, doc.y, {
                width: colWidth,
                align: 'right',
                lineBreak: false,
              });
            } else {
              doc.text(cellValue, currentX, doc.y, {
                width: colWidth,
                align: 'left',
                lineBreak: false,
              });
              currentX += colWidth;
            }
          });

          doc.moveDown(0.8);

          // Draw light separator line between rows
          if (rowIndex < data.length - 1) {
            const separatorY = doc.y;
            doc
              .moveTo(doc.page.margins.left, separatorY)
              .lineTo(doc.page.width - doc.page.margins.right, separatorY)
              .strokeOpacity(0.2)
              .stroke()
              .strokeOpacity(1);
            doc.moveDown(0.3);
          }
        });

        // Finalize PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
