import {
  Body, Controller, Get, Param, Patch, Post,
  Query, UseGuards, UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UploadExamUseCase } from '../../../application/exam/upload-exam.usecase';
import { ValidateExamUseCase } from '../../../application/exam/validate-exam.usecase';
import { GetExamsUseCase } from '../../../application/exam/get-exam.usecase';
import { CloudinaryService } from '../../storage/cloudinary.service';

@ApiTags('Exams')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('exams')
export class ExamController {
  constructor(
      private uploadExamUseCase: UploadExamUseCase,
      private validateExamUseCase: ValidateExamUseCase,
      private getExamsUseCase: GetExamsUseCase,
      private cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lister toutes les épreuves validées' })
  @ApiQuery({ name: 'level', required: false, example: 'Terminale' })
  @ApiQuery({ name: 'subject', required: false, example: 'Mathématiques' })
  @ApiResponse({ status: 200, description: 'Liste des épreuves' })
  findAll(@Query('level') level?: string, @Query('subject') subject?: string) {
    return this.getExamsUseCase.execute({ level, subject });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Voir une épreuve avec ses questions et corrigés' })
  @ApiParam({ name: 'id', description: 'UUID de l\'épreuve' })
  @ApiResponse({ status: 200, description: 'Détails de l\'épreuve' })
  @ApiResponse({ status: 404, description: 'Épreuve non trouvée' })
  findOne(@Param('id') id: string) {
    return this.uploadExamUseCase.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Uploader une nouvelle épreuve (Teacher/Admin only)' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiResponse({ status: 201, description: 'Épreuve créée, en attente de validation' })
  @ApiResponse({ status: 403, description: 'Accès interdit: rôle teacher ou admin requis' })
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'application/pdf') {
        cb(new BadRequestException('Only PDF files allowed'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: any,
      @CurrentUser() user: any,
  ) {
    let fileUrl = body.fileUrl || '';
    if (file) {
      fileUrl = await this.cloudinaryService.uploadPdf(file.buffer, `${Date.now()}-${file.originalname}`);
    }
    if (!fileUrl) throw new BadRequestException('Provide a file or a fileUrl');

    const questions = body.questions
        ? (typeof body.questions === 'string' ? JSON.parse(body.questions) : body.questions)
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

  @Patch(':id/validate')
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Valider une épreuve (Teacher/Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID de l\'épreuve' })
  @ApiResponse({ status: 200, description: 'Épreuve validée' })
  @ApiResponse({ status: 400, description: 'Épreuve déjà validée' })
  @ApiResponse({ status: 403, description: 'Accès interdit: rôle teacher ou admin requis' })
  @ApiResponse({ status: 404, description: 'Épreuve non trouvée' })
  validate(@Param('id') id: string, @CurrentUser() user: any) {
    return this.validateExamUseCase.execute(id, user.id);
  }
}