import { Injectable } from '@nestjs/common';

export interface AICorrection {
  explanation: string;
  feedback: string;
}

@Injectable()
export class AiService {
  //simulation pour use en mode dev
  async generateCorrection(
    questions: {
      text: string;
      correct: string;
      given: string;
      points: number;
    }[],
    totalScore: number,
    maxScore: number,
  ): Promise<AICorrection> {
    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= 50;

    const explanation = passed
      ? `Bon travail ! Tu as obtenu ${totalScore}/${maxScore} points (${percentage}%). Continue à t'entraîner pour améliorer encore tes résultats.`
      : `Tu as obtenu ${totalScore}/${maxScore} points (${percentage}%). ` +
        `Revois les chapitres correspondants et réessaie.`;

    return { explanation, feedback: passed ? 'Réussi' : 'À revoir' };
  }
}
