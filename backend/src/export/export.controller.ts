import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { ExportRequestDto, ExportFormat } from './dto/export-request.dto';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post()
  async export(
    @Body() exportRequestDto: ExportRequestDto,
    @Res() res: Response,
  ) {
    try {
      const { format, datasetType, filters } = exportRequestDto;

      // Generate export file
      const buffer = await this.exportService.exportData(
        datasetType,
        format,
        filters,
      );

      // Set appropriate headers based on format
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${datasetType}_${timestamp}`;

      if (format === ExportFormat.XLSX) {
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}.xlsx"`,
        );
      } else if (format === ExportFormat.PDF) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}.pdf"`,
        );
      }

      res.setHeader('Content-Length', buffer.length);
      res.status(HttpStatus.OK).send(buffer);
    } catch (error: any) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to generate export file',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
