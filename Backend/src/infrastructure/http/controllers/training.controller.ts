import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { StartTrainingUseCase } from '../../../application/training/start-training.usecase';
import { SubmitTrainingUseCase } from '../../../application/training/submit-training.usecase';
import { GetCorrectionUseCase } from '../../../application/training/get-correction.usecase';

@ApiTags('Trainings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('trainings')
export class TrainingController {
  constructor(
      private startTraining: StartTrainingUseCase,
      private submitTraining: SubmitTrainingUseCase,
      private getCorrection: GetCorrectionUseCase,
  ) {}

  @Post('start')
  @ApiOperation({ summary: 'Démarrer une session d\'entraînement sur une épreuve' })
  @ApiBody({
    schema: {
      example: { examId: '9f1eecd1-03bb-48c6-a097-857ede62c22c' },
    },
  })
  @ApiResponse({ status: 201, description: 'Session démarrée' })
  @ApiResponse({ status: 404, description: 'Épreuve non trouvée' })
  @ApiResponse({ status: 400, description: 'Épreuve non validée' })
  start(@Body('examId') examId: string, @CurrentUser() user: any) {
    return this.startTraining.execute(user.id, examId);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Soumettre les réponses et obtenir la correction IA' })
  @ApiParam({ name: 'id', description: 'UUID de la session d\'entraînement' })
  @ApiBody({
    schema: {
      example: {
        answers: [
          { questionId: 'uuid-question-1', answer: '4' },
          { questionId: 'uuid-question-2', answer: '2x' },
        ],
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Correction générée avec score et explication IA' })
  submit(@Param('id') id: string, @Body('answers') answers: any[]) {
    return this.submitTraining.execute(id, answers);
  }

  @Get(':id/correction')
  @ApiOperation({ summary: 'Voir la correction d\'une session terminée' })
  @ApiParam({ name: 'id', description: 'UUID de la session d\'entraînement' })
  @ApiResponse({ status: 200, description: 'Correction avec score, pourcentage et explication IA' })
  @ApiResponse({ status: 404, description: 'Correction non trouvée' })
  correction(@Param('id') id: string) {
    return this.getCorrection.execute(id);
  }
}