import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { StartTrainingUseCase } from '../../../application/training/start-training.usecase';
import { SubmitTrainingUseCase } from '../../../application/training/submit-training.usecase';
import { GetCorrectionUseCase } from '../../../application/training/get-correction.usecase';
import { AnswerStepUseCase } from '../../../application/training/answer-step.usecase';
import { LearningSummaryUseCase } from '../../../application/training/learning-summary.usecase';

@ApiTags('Trainings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('trainings')
export class TrainingController {
  constructor(
      private startTraining: StartTrainingUseCase,
      private submitTraining: SubmitTrainingUseCase,
      private getCorrection: GetCorrectionUseCase,
      private answerStep: AnswerStepUseCase,
      private learningSummary: LearningSummaryUseCase,
  ) {}

  @Post('start')
  @ApiOperation({ summary: 'Démarrer une session d\'entraînement' })
  @ApiBody({ schema: { example: { examId: 'uuid-exam' } } })
  start(@Body('examId') examId: string, @CurrentUser() user: any) {
    return this.startTraining.execute(user.id, examId);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Soumettre toutes les réponses — correction IA complète' })
  @ApiParam({ name: 'id', description: 'UUID du training' })
  @ApiBody({
    schema: {
      example: {
        answers: [
          { questionId: 'uuid-q1', answer: '1' },
          { questionId: 'uuid-q2', answer: '3x^2 + 4x - 5' },
        ],
      },
    },
  })
  submit(@Param('id') id: string, @Body('answers') answers: any[]) {
    return this.submitTraining.execute(id, answers);
  }

  @Post(':id/answer-step')
  @ApiOperation({ summary: 'Mode learning — répondre question par question avec feedback IA immédiat' })
  @ApiParam({ name: 'id', description: 'UUID du training' })
  @ApiBody({
    schema: {
      example: {
        questionId: 'uuid-question',
        answer: '1',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Feedback IA immédiat : correct/incorrect + explication + conseil' })
  answerStepHandler(
      @Param('id') id: string,
      @Body('questionId') questionId: string,
      @Body('answer') answer: string,
  ) {
    return this.answerStep.execute(id, questionId, answer);
  }

  @Get(':id/learning-summary')
  @ApiOperation({ summary: 'Résumé d\'apprentissage IA — forces, faiblesses, recommandations' })
  @ApiParam({ name: 'id', description: 'UUID du training' })
  @ApiResponse({ status: 200, description: 'Analyse complète de la session avec conseils personnalisés' })
  getSummary(@Param('id') id: string) {
    return this.learningSummary.execute(id);
  }

  @Get(':id/correction')
  @ApiOperation({ summary: 'Voir la correction complète d\'une session' })
  @ApiParam({ name: 'id', description: 'UUID du training' })
  correction(@Param('id') id: string) {
    return this.getCorrection.execute(id);
  }
}