import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UploadExamUseCase } from '../../../application/exam/upload-exam.usecase';
import { ValidateExamUseCase } from '../../../application/exam/validate-exam.usecase';
import { GetExamsUseCase } from '../../../application/exam/get-exam.usecase';
import { CloudinaryService } from '../../storage/cloudinary.service';

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamController {
  constructor(
    private uploadExamUseCase: UploadExamUseCase,
    private validateExamUseCase: ValidateExamUseCase,
    private getExamsUseCase: GetExamsUseCase,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Lister toutes les épreuves validées
  @Get()
  findAll(@Query('level') level?: string, @Query('subject') subject?: string) {
    return this.getExamsUseCase.execute({ level, subject });
  }

  // Voir une épreuve + ses questions
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.uploadExamUseCase.findById(id);
  }

  // Uploader une épreuve avec son PDF
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          cb(new BadRequestException('Only PDF files allowed'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    let fileUrl = body.fileUrl || '';

    // Si un fichier est uploadé, on l'envoie sur Cloudinary
    if (file) {
      fileUrl = await this.cloudinaryService.uploadPdf(
        file.buffer,
        `${Date.now()}-${file.originalname}`,
      );
    }

    if (!fileUrl) throw new BadRequestException('Provide a file or a fileUrl');

    const questions = body.questions
      ? typeof body.questions === 'string'
        ? JSON.parse(body.questions)
        : body.questions
      : [];

    return this.uploadExamUseCase.execute({
      title: body.title,
      subject: body.subject,
      year: parseInt(body.year),
      level: body.level,
      fileUrl,
      uploadedById: user.id,
      questions,
    });
  }

  // Valider une épreuve (Teacher/Admin)
  @Patch(':id/validate')
  validate(@Param('id') id: string, @CurrentUser() user: any) {
    return this.validateExamUseCase.execute(id, user.id);
  }
}
