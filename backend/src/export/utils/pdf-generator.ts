// pdf-generator.ts
import PDFDocument from 'pdfkit';
import amiriFontBase64 from '../font/amiriFontBase64';
import limelightFontBase64 from '../font/limelightFontBase64';
import fs from 'fs';
import path from 'path';

export interface PDFColumn {
  header: string;
  key: string;
  width?: number; // relative weight if given
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

  static async generate(options: PDFGeneratorOptions): Promise<Buffer> {
    const { title, columns, data, rtl = true } = options;

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'portrait',
          margins: { top: 80, bottom: 50, left: 20, right: 20 },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        // Register Amiri font
        const amiriFontBuffer = Buffer.from(amiriFontBase64, 'base64');
        const limelightFontBuffer = Buffer.from(limelightFontBase64, 'base64');
        doc.registerFont('Amiri', amiriFontBuffer);
        doc.registerFont('Limelight', limelightFontBuffer);

        // Add header
        PDFGenerator.addHeader(doc, rtl);

        // Move down into content area
        doc.moveDown(1);
        doc.font('Amiri');
        doc.fontSize(16);

        // Title
        doc.text(title || 'سجل الحضور والغياب', {
          align: rtl ? 'right' : 'left',
          features: rtl ? ['rtla'] : [],
        });
        doc.moveDown(1);

        // Prepare columns and widths
        const pageWidth =
          doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const totalWeight = columns.reduce(
          (sum, col) => sum + (col.width ?? 1),
          0,
        );
        const columnWidths = columns.map(
          (col) => ((col.width ?? 1) / totalWeight) * pageWidth,
        );

        // Header row
        doc.fontSize(12);
        const headerY = doc.y;

        let currentX = rtl
          ? doc.page.width - doc.page.margins.right
          : doc.page.margins.left;

        columns.forEach((col, idx) => {
          const w = columnWidths[idx];
          if (rtl) {
            currentX -= w;
            doc.text(col.header, currentX, headerY, {
              width: w,
              align: 'right',
              features: ['rtla'],
              lineBreak: true,
            });
          } else {
            doc.text(col.header, currentX, headerY, {
              width: w,
              align: 'left',
              lineBreak: true,
            });
            currentX += w;
          }
        });

        doc.moveDown(0.5);

        // Draw a line below header
        const afterHeaderY = doc.y + 12;
        doc
          .moveTo(doc.page.margins.left, afterHeaderY)
          .lineTo(doc.page.width - doc.page.margins.right, afterHeaderY)
          .stroke();

        doc.moveDown(0.5);

        // Body rows
        doc.fontSize(10);

        if (!data || data.length === 0) {
          doc.text('لا توجد بيانات متاحة', {
            align: 'center',
            features: rtl ? ['rtla'] : [],
          });
        } else {
          data.forEach((row, rowIndex) => {
            const startY = doc.y;

            // Page break check
            if (startY > doc.page.height - doc.page.margins.bottom - 40) {
              doc.addPage();
              // re-draw header on new page
              PDFGenerator.addHeader(doc, rtl);
              doc.moveDown(2);
              doc.font('Amiri').fontSize(10);
            }

            // Compute row height (max among cells)
            let maxCellHeight = 0;
            columns.forEach((col, ci) => {
              const w = columnWidths[ci];
              const txt = String(row[col.key] ?? '');
              const h = doc.heightOfString(txt, {
                width: w,
                align: rtl ? 'right' : 'left',
                features: rtl ? ['rtla'] : [],
                lineBreak: true,
              });
              maxCellHeight = Math.max(maxCellHeight, h);
            });

            // Draw each cell
            currentX = rtl
              ? doc.page.width - doc.page.margins.right
              : doc.page.margins.left;

            columns.forEach((col, ci) => {
              const w = columnWidths[ci];
              const txt = String(row[col.key] ?? '');
              if (rtl) {
                currentX -= w;
                doc.text(txt, currentX, startY, {
                  width: w,
                  align: 'right',
                  features: ['rtla'],
                  lineBreak: true,
                });
              } else {
                doc.text(txt, currentX, startY, {
                  width: w,
                  align: 'left',
                  lineBreak: true,
                });
                currentX += w;
              }
            });

            // Advance vertical position
            doc.y = startY + maxCellHeight + 8;

            // Separator
            if (rowIndex < data.length - 1) {
              const sepY = doc.y - 3;
              doc
                .moveTo(doc.page.margins.left, sepY)
                .lineTo(doc.page.width - doc.page.margins.right, sepY)
                .strokeOpacity(0.3)
                .stroke()
                .strokeOpacity(1);
              doc.moveDown(0.4);
            }
          });
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  private static addHeader(doc: PDFKit.PDFDocument, rtl: boolean): void {
    const headerY = 30;
    const logoSize = 65;
    doc.font('Limelight');
    doc.fontSize(17);

    // Left / English
    doc.text(
      "AL- RASHIDYA SECONDARY BOY'S SCHOOL - Jerusalem",
      doc.page.margins.left,
      headerY,
      { width: 200, align: 'left' },
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

    // Arabic on right
    doc.font('Amiri');
    doc.fontSize(18);
    const rightX = doc.page.width - doc.page.margins.right - 200;
    doc.text('المدرسة الرشيدية الثانوية للبنين القدس', rightX, headerY, {
      width: 200,
      align: 'right',
      features: ['rtla'],
    });

    // Horizontal line under header
    const lineY = headerY + 70;
    doc
      .moveTo(doc.page.margins.left, lineY)
      .lineTo(doc.page.width - doc.page.margins.right, lineY)
      .strokeOpacity(0.5)
      .stroke();
    doc.strokeOpacity(1);
  }
}
