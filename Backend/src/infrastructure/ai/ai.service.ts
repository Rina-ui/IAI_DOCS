import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AICorrection {
    explanation: string;
    feedback: string;
    detailedCorrections: {
        questionText: string;
        givenAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        explanation: string;
    }[];
}

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private genAI: GoogleGenerativeAI;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    }

    async generateCorrection(
        questions: { text: string; correct: string; given: string; points: number }[],
        totalScore: number,
        maxScore: number,
    ): Promise<AICorrection> {
        const percentage = Math.round((totalScore / maxScore) * 100);

        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `
Tu es un professeur qui corrige une épreuve d'un étudiant de l'IAI (Institut Africain d'Informatique).

Voici les résultats :
- Score : ${totalScore}/${maxScore} points (${percentage}%)

Questions et réponses :
${questions.map((q, i) => `
Question ${i + 1}: ${q.text}
Bonne réponse: ${q.correct}
Réponse donnée: ${q.given}
Points: ${q.points}
`).join('\n')}

Génère une correction pédagogique en français. Réponds UNIQUEMENT en JSON valide avec cette structure :
{
  "explanation": "Bilan général de la performance de l'étudiant (2-3 phrases encourageantes et constructives)",
  "feedback": "Réussi" ou "À revoir",
  "detailedCorrections": [
    {
      "questionText": "texte de la question",
      "givenAnswer": "réponse donnée",
      "correctAnswer": "bonne réponse",
      "isCorrect": true ou false,
      "explanation": "explication pédagogique de pourquoi c'est correct ou incorrect"
    }
  ]
}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Nettoyer la réponse
            const clean = text.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(clean);
            return parsed as AICorrection;

        } catch (error) {
            this.logger.error('Gemini API error:', error);
            // Fallback si l'IA échoue
            return {
                explanation: `Tu as obtenu ${totalScore}/${maxScore} points (${percentage}%). ${percentage >= 50 ? 'Bon travail, continue ainsi !' : 'Continue à travailler, tu vas y arriver !'}`,
                feedback: percentage >= 50 ? 'Réussi' : 'À revoir',
                detailedCorrections: questions.map(q => ({
                    questionText: q.text,
                    givenAnswer: q.given,
                    correctAnswer: q.correct,
                    isCorrect: q.given.trim().toLowerCase() === q.correct.trim().toLowerCase(),
                    explanation: 'Correction automatique',
                })),
            };
        }
    }
}