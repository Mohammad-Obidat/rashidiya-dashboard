import PDFDocument from 'pdfkit';
import amiriFontBase64 from '../font/amiriFontBase64';
import fs from 'fs';
import path from 'path';

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
  logo?: Buffer | string;
}

export class PDFGenerator {
  private static readonly LOGO_PATH = path.join(
    __dirname,
    '../assets/logo.jpeg',
  );

  /*
   * Generate PDF file buffer from data
   */

  static async generate(options: PDFGeneratorOptions): Promise<Buffer> {
    const { title, columns, data, rtl = true } = options;

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: { top: 100, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
          console.log('=== PDF GENERATION COMPLETED ===');
          resolve(Buffer.concat(chunks));
        });
        doc.on('error', (error) => {
          console.error('=== PDF GENERATION ERROR ===', error);
          reject(error);
        });

        // Register Amiri font
        const fontBuffer = Buffer.from(amiriFontBase64, 'base64');
        doc.registerFont('Amiri', fontBuffer);

        // Add header
        PDFGenerator.addHeader(doc, rtl);

        // Reset to main content area
        doc.y = 100;
        doc.font('Amiri');

        // Add title
        doc.fontSize(18);
        doc.text(title || 'سجل الحضور والغياب', {
          align: rtl ? 'right' : 'left',
          features: rtl ? ['rtla'] : [],
        });
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
              features: ['rtla'],
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

        if (!data || data.length === 0) {
          doc.text('لا توجد بيانات متاحة', {
            align: 'center',
            features: rtl ? ['rtla'] : [],
          });
        } else {
          data.forEach((row, rowIndex) => {
            const startY = doc.y;

            // Check if we need a new page
            if (startY > doc.page.height - doc.page.margins.bottom - 50) {
              doc.addPage();
              doc.font('Amiri');
              doc.fontSize(10);
            }

            // Calculate row height
            let maxCellHeight = 0;
            columns.forEach((col, colIndex) => {
              const colWidth = columnWidths[colIndex];
              const cellValue = String(row[col.key] ?? '');

              const textHeight = doc.heightOfString(cellValue, {
                width: colWidth,
                align: rtl ? 'right' : 'left',
                features: rtl ? ['rtla'] : [],
                lineBreak: true,
              });

              maxCellHeight = Math.max(maxCellHeight, textHeight);
            });

            // Draw cells
            currentX = rtl
              ? doc.page.width - doc.page.margins.right
              : doc.page.margins.left;

            columns.forEach((col, colIndex) => {
              const colWidth = columnWidths[colIndex];
              const cellValue = String(row[col.key] ?? '');

              if (rtl) {
                currentX -= colWidth;
                doc.text(cellValue, currentX, startY, {
                  width: colWidth,
                  align: 'right',
                  features: ['rtla'],
                  lineBreak: true,
                });
              } else {
                doc.text(cellValue, currentX, startY, {
                  width: colWidth,
                  align: 'left',
                  lineBreak: true,
                });
                currentX += colWidth;
              }
            });

            doc.y = startY + maxCellHeight + 8;

            // Draw separator line
            if (rowIndex < data.length - 1) {
              const separatorY = doc.y - 4;
              doc
                .moveTo(doc.page.margins.left, separatorY)
                .lineTo(doc.page.width - doc.page.margins.right, separatorY)
                .strokeOpacity(0.2)
                .stroke()
                .strokeOpacity(1);
              doc.moveDown(0.3);
            }
          });
        }

        doc.end();
      } catch (error) {
        console.error('=== PDF GENERATION CATCH ERROR ===', error);
        reject(error);
      }
    });
  }

  /**
   * Add school header to the document
   */
  private static addHeader(doc: PDFKit.PDFDocument, rtl: boolean): void {
    const headerY = 30;
    const logoSize = 40;

    doc.font('Amiri');

    // English text - Top Left
    doc.fontSize(10);
    doc.text(
      "AL- RASHIDYA SECONDARY BOY'S SCHOOL - Jerusalem",
      doc.page.margins.left,
      headerY,
      {
        align: 'left',
        width: 200,
      },
    );

    // School logo - Top Center
    try {
      const logoX = (doc.page.width - logoSize) / 2;

      if (fs.existsSync(PDFGenerator.LOGO_PATH)) {
        doc.image(PDFGenerator.LOGO_PATH, logoX, headerY, {
          width: logoSize,
          height: logoSize,
        });

        // Add establishment year
        doc.fontSize(8);
        doc.text('Est.1904', doc.page.width / 2 - 20, headerY + logoSize + 5, {
          align: 'center',
        });
      } else {
        console.error('ERROR: Logo file not found at:', PDFGenerator.LOGO_PATH);

        const alternativePath = path.join(
          process.cwd(),
          'src',
          'export',
          'assets',
          'logo.jpeg',
        );
        console.log('Trying alternative path:', alternativePath);

        if (fs.existsSync(alternativePath)) {
          console.log('SUCCESS: Logo found at alternative path');
          doc.image(alternativePath, logoX, headerY, {
            width: logoSize,
            height: logoSize,
          });
        } else {
          doc.rect(logoX, headerY, logoSize, logoSize).stroke();
          doc.text('شعار المدرسة', logoX, headerY + logoSize / 2 - 5, {
            width: logoSize,
            align: 'center',
            features: ['rtla'],
          });
        }
      }
    } catch (error) {
      console.error('ERROR loading logo:', error);
      const logoX = (doc.page.width - logoSize) / 2;
      doc.rect(logoX, headerY, logoSize, logoSize).stroke();
      doc.text('شعار المدرسة', logoX, headerY + logoSize / 2 - 5, {
        width: logoSize,
        align: 'center',
        features: ['rtla'],
      });
    }

    // Arabic text - Top Right
    doc.fontSize(10);
    doc.text(
      'المدرسة الرشيدية الثانوية للبنين - القدس',
      doc.page.width - doc.page.margins.right - 200,
      headerY,
      {
        width: 200,
        align: 'right',
        features: ['rtla'],
      },
    );

    // Add separator line
    const lineY = headerY + 60;
    doc
      .moveTo(doc.page.margins.left, lineY)
      .lineTo(doc.page.width - doc.page.margins.right, lineY)
      .strokeOpacity(0.5)
      .stroke();
  }
}
