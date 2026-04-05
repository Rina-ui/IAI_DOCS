import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { StartTrainingUseCase } from '../../../application/training/start-training.usecase';
import { SubmitTrainingUseCase } from '../../../application/training/submit-training.usecase';
import { GetCorrectionUseCase } from '../../../application/training/get-correction.usecase';

@Controller('trainings')
@UseGuards(JwtAuthGuard)
export class TrainingController {
  constructor(
    private startTraining: StartTrainingUseCase,
    private submitTraining: SubmitTrainingUseCase,
    private getCorrection: GetCorrectionUseCase,
  ) {}

  @Post('start')
  start(@Body('examId') examId: string, @CurrentUser() user: any) {
    return this.startTraining.execute(user.id, examId);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @Body('answers') answers: any[]) {
    return this.submitTraining.execute(id, answers);
  }

  @Get(':id/correction')
  correction(@Param('id') id: string) {
    return this.getCorrection.execute(id);
  }
}
