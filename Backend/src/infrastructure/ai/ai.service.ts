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

export interface AIStepFeedback {
    explanation: string;
    tip: string;
    resourceToReview: string;
}

export interface AILearningSummary {
    globalFeedback: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    motivationalMessage: string;
}

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    // ─── Correction complète après soumission ─────────────────────
    async generateCorrection(
        questions: { text: string; correct: string; given: string; points: number }[],
        totalScore: number,
        maxScore: number,
    ): Promise<AICorrection> {
        const percentage = Math.round((totalScore / maxScore) * 100);

        try {
            const prompt = `
Tu es un professeur de l'IAI (Institut Africain d'Informatique) qui corrige une épreuve.
Score : ${totalScore}/${maxScore} points (${percentage}%)

Questions et réponses :
${questions.map((q, i) => `
Question ${i + 1}: ${q.text}
Bonne réponse: ${q.correct}
Réponse donnée: ${q.given}
Points: ${q.points}
`).join('\n')}

Réponds UNIQUEMENT en JSON valide sans backticks :
{
  "explanation": "Bilan général (2-3 phrases encourageantes)",
  "feedback": "Réussi ou À revoir",
  "detailedCorrections": [
    {
      "questionText": "...",
      "givenAnswer": "...",
      "correctAnswer": "...",
      "isCorrect": true,
      "explanation": "explication pédagogique"
    }
  ]
}`;

            const result = await this.model.generateContent(prompt);
            const text = result.response.text().replace(/```json|```/g, '').trim();
            return JSON.parse(text) as AICorrection;

        } catch (error) {
            this.logger.error('Gemini correction error:', error);
            return this.fallbackCorrection(questions, totalScore, maxScore, percentage);
        }
    }

    // ─── Feedback immédiat question par question (mode learning) ──
    async generateStepFeedback(
        questionText: string,
        correctAnswer: string,
        givenAnswer: string,
        isCorrect: boolean,
        baseExplanation: string,
    ): Promise<AIStepFeedback> {
        try {
            const prompt = `
Tu es un tuteur pédagogique de l'IAI. Un étudiant vient de répondre à une question.

Question : ${questionText}
Bonne réponse : ${correctAnswer}
Réponse de l'étudiant : ${givenAnswer}
Résultat : ${isCorrect ? 'CORRECT' : 'INCORRECT'}
Explication de base : ${baseExplanation}

Génère un retour pédagogique immédiat et bienveillant en JSON sans backticks :
{
  "explanation": "${isCorrect ? 'Confirme pourquoi cest correct en 1-2 phrases' : 'Explique clairement lerreur et la bonne demarche en 2-3 phrases'}",
  "tip": "Un conseil pratique pour retenir ce concept",
  "resourceToReview": "Le concept ou chapitre precis a revoir (ex: Theoreme de LHopital, Chapitre 3 - Derivation)"
}`;

            const result = await this.model.generateContent(prompt);
            const text = result.response.text().replace(/```json|```/g, '').trim();
            return JSON.parse(text) as AIStepFeedback;

        } catch (error) {
            this.logger.error('Gemini step feedback error:', error);
            return {
                explanation: isCorrect
                    ? `Correct ! ${baseExplanation}`
                    : `Incorrect. La bonne réponse est : ${correctAnswer}. ${baseExplanation}`,
                tip: 'Revois ce concept dans ton cours.',
                resourceToReview: 'Cours correspondant à cette question',
            };
        }
    }

    // ─── Résumé d'apprentissage final ─────────────────────────────
    async generateLearningSummary(
        score: number,
        maxScore: number,
        questions: { text: string; points: number }[],
    ): Promise<AILearningSummary> {
        const percentage = Math.round((score / maxScore) * 100);

        try {
            const prompt = `
Tu es un conseiller pédagogique de l'IAI. Un étudiant vient de terminer une session d'entraînement.
Score final : ${score}/${maxScore} (${percentage}%)

Questions de l'épreuve :
${questions.map((q, i) => `${i + 1}. ${q.text} (${q.points} pts)`).join('\n')}

Génère un résumé d'apprentissage complet en JSON sans backticks :
{
  "globalFeedback": "Analyse globale de la performance (3-4 phrases)",
  "strengths": ["Point fort 1", "Point fort 2"],
  "weaknesses": ["Point faible 1", "Point faible 2"],
  "recommendations": ["Conseil 1 concret", "Conseil 2 concret", "Conseil 3 concret"],
  "motivationalMessage": "Message motivant et personnalisé selon le score"
}`;

            const result = await this.model.generateContent(prompt);
            const text = result.response.text().replace(/```json|```/g, '').trim();
            return JSON.parse(text) as AILearningSummary;

        } catch (error) {
            this.logger.error('Gemini summary error:', error);
            return {
                globalFeedback: `Tu as obtenu ${score}/${maxScore} points (${percentage}%). ${percentage >= 50 ? 'Bon travail !' : 'Continue à travailler !'}`,
                strengths: ['Participation active'],
                weaknesses: ['À identifier après révision'],
                recommendations: ['Revoir les chapitres correspondants', 'Refaire l\'exercice', 'Consulter ton professeur'],
                motivationalMessage: percentage >= 50 ? 'Continue sur cette lancée !' : 'Ne te décourage pas, tu vas y arriver !',
            };
        }
    }

    private fallbackCorrection(questions: any[], totalScore: number, maxScore: number, percentage: number): AICorrection {
        return {
            explanation: `Tu as obtenu ${totalScore}/${maxScore} points (${percentage}%). ${percentage >= 50 ? 'Bon travail !' : 'Continue à travailler !'}`,
            feedback: percentage >= 50 ? 'Réussi' : 'À revoir',
            detailedCorrections: questions.map(q => ({
                questionText: q.text,
                givenAnswer: q.given,
                correctAnswer: q.correct,
                isCorrect: q.given?.trim().toLowerCase() === q.correct?.trim().toLowerCase(),
                explanation: 'Correction automatique',
            })),
        };
    }
}