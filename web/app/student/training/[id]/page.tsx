"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getExam } from "@/lib/examService";
import { startTraining, submitTraining, submitAnswerStep } from "@/lib/trainingService";
import type { Exam, ExamQuestion, TrainingAnswer } from "@/lib/types";
import { ArrowLeft, Send, CheckCircle, AlertCircle, BookOpen, FileText, Lightbulb, ChevronRight, ChevronLeft } from "lucide-react";

export default function TrainingSessionPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Mode selection: 'exam' (full submission) or 'learning' (step-by-step)
  const [selectedMode, setSelectedMode] = useState<'exam' | 'learning' | null>(null);

  // Learning mode state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [stepFeedback, setStepFeedback] = useState<{
    questionId: string;
    questionText: string;
    givenAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    explanation: string;
    tip: string;
    resourceToReview: string;
  } | null>(null);
  const [learningResults, setLearningResults] = useState<Array<{
    questionId: string;
    questionText: string;
    isCorrect: boolean;
    pointsEarned: number;
  }>>([]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const data = await getExam(examId);
        setExam(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger l'examen.");
        console.error("Failed to fetch exam:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const handleStartTraining = async (mode: 'exam' | 'learning') => {
    try {
      console.log(`🚀 Starting training in ${mode} mode for exam:`, examId);
      const session = await startTraining({ examId });
      setSessionId(session.id);
      setSelectedMode(mode);
      setError(null);

      if (mode === 'learning') {
        setCurrentQuestionIndex(0);
        setCurrentAnswer("");
        setStepFeedback(null);
        setLearningResults([]);
      }
    } catch (err) {
      setError("Impossible de démarrer la session d'entraînement.");
      console.error("Failed to start training:", err);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitExam = async () => {
    if (!sessionId) return;

    try {
      setSubmitting(true);
      const formattedAnswers: TrainingAnswer[] = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );

      const correction = await submitTraining(sessionId, {
        answers: formattedAnswers,
      });

      // Navigate to correction page
      router.push(`/student/training/${examId}/correction?sessionId=${sessionId}`);
    } catch (err) {
      setError("Impossible de soumettre vos réponses.");
      console.error("Failed to submit training:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLearningSubmitAnswer = async () => {
    if (!sessionId || !exam) return;

    const currentQuestion = exam.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    try {
      setSubmitting(true);
      console.log("📝 Submitting answer for question:", currentQuestion.id);

      const feedback = await submitAnswerStep(sessionId, {
        questionId: currentQuestion.id,
        answer: currentAnswer,
      });

      console.log("✅ Received step feedback:", feedback);
      setStepFeedback(feedback);

      // Store result
      setLearningResults(prev => [...prev, {
        questionId: currentQuestion.id,
        questionText: currentQuestion.content,
        isCorrect: feedback.isCorrect,
        pointsEarned: feedback.score,
      }]);
    } catch (err) {
      setError("Impossible de soumettre votre réponse.");
      console.error("Failed to submit answer:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!exam) return;
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer("");
      setStepFeedback(null);
    } else {
      // All questions answered, show summary
      router.push(`/student/training/${examId}/learning-summary?sessionId=${sessionId}`);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setCurrentAnswer("");
      setStepFeedback(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-neutral rounded-xl" />
        <div className="h-40 bg-neutral rounded-2xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-neutral rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-error">
        <p className="font-bold">{error || "Examen non trouvé"}</p>
      </div>
    );
  }

  // Mode selection screen
  if (!sessionId) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <header>
          <a
            href="/student/training"
            className="inline-flex items-center gap-2 text-secondary hover:text-on-surface mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux entraînements
          </a>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
            {exam.title}
          </h1>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-neutral px-3 py-1 rounded-lg font-medium text-secondary">
              {exam.subject}
            </span>
            <span className="bg-neutral px-3 py-1 rounded-lg font-medium text-secondary">
              {exam.level}
            </span>
            <span className="bg-neutral px-3 py-1 rounded-lg font-medium text-secondary">
              {exam.year}
            </span>
          </div>
        </header>

        {/* Mode Selection */}
        <div className="bg-surface border border-secondary/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-on-surface mb-3 text-center">
            Choisissez votre mode d'entraînement
          </h2>
          <p className="text-secondary mb-8 text-center">
            {exam.questions.length} questions disponibles
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Exam Mode */}
            <button
              onClick={() => handleStartTraining('exam')}
              className="group bg-surface border-2 border-secondary/20 hover:border-primary rounded-2xl p-8 text-left transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <FileText size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                Mode Examen
              </h3>
              <p className="text-sm text-secondary mb-4">
                Répondez à toutes les questions puis obtenez la correction complète avec score final.
              </p>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                Commencer <ChevronRight size={16} />
              </div>
            </button>

            {/* Learning Mode */}
            <button
              onClick={() => handleStartTraining('learning')}
              className="group bg-surface border-2 border-secondary/20 hover:border-tertiary rounded-2xl p-8 text-left transition-all hover:shadow-xl hover:shadow-tertiary/10 hover:-translate-y-1"
            >
              <div className="bg-tertiary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-tertiary/20 transition-colors">
                <BookOpen size={32} className="text-tertiary" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-tertiary transition-colors">
                Mode Apprentissage
              </h3>
              <p className="text-sm text-secondary mb-4">
                Répondez question par question avec un feedback IA immédiat et des conseils personnalisés.
              </p>
              <div className="flex items-center gap-2 text-tertiary font-semibold text-sm">
                Commencer <ChevronRight size={16} />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Learning mode flow
  if (selectedMode === 'learning') {
    const currentQuestion = exam.questions[currentQuestionIndex];
    const totalQuestions = exam.questions.length;

    return (
      <div className="space-y-8">
        {/* Header */}
        <header>
          <a
            href="/student/training"
            className="inline-flex items-center gap-2 text-secondary hover:text-on-surface mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux entraînements
          </a>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
            {exam.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-lg font-medium flex items-center gap-1">
                <BookOpen size={14} /> Mode Apprentissage
              </span>
              <span className="bg-neutral px-3 py-1 rounded-lg font-medium text-secondary">
                Question {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-surface border border-secondary/20 rounded-2xl p-4">
          <div className="flex items-center justify-between text-sm text-secondary mb-2">
            <span>Progression</span>
            <span>{Math.round(((currentQuestionIndex + (stepFeedback ? 1 : 0)) / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-neutral rounded-full h-2">
            <div
              className="bg-tertiary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + (stepFeedback ? 1 : 0)) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <span className="bg-tertiary/10 text-tertiary w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
              {currentQuestionIndex + 1}
            </span>
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-2">{currentQuestion.content}</h3>
              {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
                <p className="text-sm text-secondary">Choisissez la bonne réponse</p>
              )}
              {currentQuestion.type === "true_false" && (
                <p className="text-sm text-secondary">Vrai ou Faux ?</p>
              )}
              {currentQuestion.type === "open_ended" && (
                <p className="text-sm text-secondary">Répondez en quelques phrases</p>
              )}
            </div>
          </div>

          {/* Answer Input */}
          {!stepFeedback ? (
            <div className="ml-14">
              {currentQuestion.type === "multiple_choice" && currentQuestion.options ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-xl bg-neutral hover:bg-neutral/80 cursor-pointer transition-colors border-2 border-transparent hover:border-tertiary/50 has-[:checked]:border-tertiary has-[:checked]:bg-tertiary/10"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={currentAnswer === option}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        className="w-4 h-4 text-tertiary"
                      />
                      <span className="text-on-surface">{option}</span>
                    </label>
                  ))}
                </div>
              ) : currentQuestion.type === "true_false" ? (
                <div className="flex gap-3">
                  {["Vrai", "Faux"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setCurrentAnswer(option)}
                      className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${currentAnswer === option
                        ? "bg-tertiary text-on-primary shadow-lg"
                        : "bg-neutral text-secondary hover:bg-neutral/80"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Votre réponse..."
                  rows={5}
                  className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-tertiary/50 resize-none"
                />
              )}

              {/* Submit Answer Button */}
              <button
                onClick={handleLearningSubmitAnswer}
                disabled={submitting || !currentAnswer.trim()}
                className="mt-6 w-full bg-tertiary text-on-primary px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-tertiary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Lightbulb size={20} />
                {submitting ? "Analyse en cours..." : "Soumettre et voir le feedback"}
              </button>
            </div>
          ) : (
            /* Feedback Display */
            <div className="ml-14 space-y-4">
              {/* Result Badge */}
              <div className={`p-4 rounded-xl border-2 ${stepFeedback.isCorrect
                ? "bg-success/10 border-success/30 text-success"
                : "bg-error/10 border-error/30 text-error"
                }`}>
                <div className="flex items-center gap-3">
                  {stepFeedback.isCorrect ? (
                    <CheckCircle size={24} />
                  ) : (
                    <AlertCircle size={24} />
                  )}
                  <div>
                    <p className="font-bold text-lg">
                      {stepFeedback.isCorrect ? "Correct !" : "Incorrect"}
                    </p>
                    <p className="text-sm opacity-80">
                      Points: {stepFeedback.pointsEarned}
                    </p>
                  </div>
                </div>
              </div>

              {/* Your Answer vs Correct Answer */}
              <div className="grid gap-3">
                <div className="bg-neutral rounded-xl p-4">
                  <p className="text-xs text-secondary mb-1">Votre réponse</p>
                  <p className="font-semibold text-on-surface">{stepFeedback.givenAnswer}</p>
                </div>
                {!stepFeedback.isCorrect && (
                  <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                    <p className="text-xs text-success mb-1">Réponse correcte</p>
                    <p className="font-semibold text-on-surface">{stepFeedback.correctAnswer}</p>
                  </div>
                )}
              </div>

              {/* AI Explanation */}
              <div className="bg-surface-variant rounded-xl p-4 border border-secondary/20">
                <div className="flex items-start gap-2 mb-2">
                  <Lightbulb size={20} className="text-tertiary shrink-0 mt-0.5" />
                  <p className="font-bold text-on-surface">Explication</p>
                </div>
                <p className="text-sm text-secondary leading-relaxed">{stepFeedback.explanation}</p>
              </div>

              {/* Tip */}
              {stepFeedback.tip && (
                <div className="bg-tertiary/10 rounded-xl p-4 border border-tertiary/20">
                  <p className="text-xs text-tertiary font-semibold mb-1">💡 Conseil</p>
                  <p className="text-sm text-on-surface">{stepFeedback.tip}</p>
                </div>
              )}

              {/* Resource to Review */}
              {stepFeedback.resourceToReview && (
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <p className="text-xs text-primary font-semibold mb-1">📚 Ressource à réviser</p>
                  <p className="text-sm text-on-surface">{stepFeedback.resourceToReview}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-2">
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={handlePreviousQuestion}
                    className="flex-1 bg-neutral text-secondary px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral/80 transition-all"
                  >
                    <ChevronLeft size={18} />
                    Précédent
                  </button>
                )}
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 bg-tertiary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-tertiary/20"
                >
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <>
                      Question suivante
                      <ChevronRight size={18} />
                    </>
                  ) : (
                    <>
                      Voir le résumé
                      <CheckCircle size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Exam mode flow (original behavior)
  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <a
          href="/student/exams"
          className="inline-flex items-center gap-2 text-secondary hover:text-on-surface mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux examens
        </a>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
          {exam.title}
        </h1>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg font-medium flex items-center gap-1">
            <FileText size={14} /> Mode Examen
          </span>
          <span className="bg-neutral px-3 py-1 rounded-lg font-medium text-secondary">
            {exam.subject}
          </span>
          <span className="bg-neutral px-3 py-1 rounded-lg font-medium text-secondary">
            {exam.level}
          </span>
          <span className="bg-neutral px-3 py-1 rounded-lg font-medium text-secondary">
            {exam.year}
          </span>
        </div>
      </header>

      <div className="space-y-6">
        {/* Questions */}
        <div className="space-y-6">
          {exam.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index + 1}
              answer={answers[question.id] || ""}
              onAnswerChange={(value) => handleAnswerChange(question.id, value)}
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="bg-surface border border-secondary/20 rounded-2xl p-6 flex items-center justify-between">
          <div className="text-sm text-secondary">
            <AlertCircle size={16} className="inline mr-2" />
            {Object.keys(answers).length}/{exam.questions.length} questions répondues
          </div>
          <button
            onClick={handleSubmitExam}
            disabled={submitting || Object.keys(answers).length === 0}
            className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
          >
            <Send size={18} />
            {submitting ? "Soumission..." : "Soumettre et voir la correction"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  answer,
  onAnswerChange,
}: {
  question: ExamQuestion;
  index: number;
  answer: string;
  onAnswerChange: (value: string) => void;
}) {
  return (
    <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0">
          {index}
        </span>
        <div>
          <h3 className="text-lg font-bold text-on-surface mb-2">{question.content}</h3>
          {question.type === "multiple_choice" && question.options && (
            <p className="text-sm text-secondary">Choisissez la bonne réponse</p>
          )}
          {question.type === "true_false" && (
            <p className="text-sm text-secondary">Vrai ou Faux ?</p>
          )}
          {question.type === "open_ended" && (
            <p className="text-sm text-secondary">Répondez en quelques phrases</p>
          )}
        </div>
      </div>

      {question.type === "multiple_choice" && question.options ? (
        <div className="space-y-2 ml-12">
          {question.options.map((option, i) => (
            <label
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-neutral hover:bg-neutral/80 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={answer === option}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-on-surface">{option}</span>
            </label>
          ))}
        </div>
      ) : question.type === "true_false" ? (
        <div className="flex gap-3 ml-12">
          {["Vrai", "Faux"].map((option) => (
            <button
              key={option}
              onClick={() => onAnswerChange(option)}
              className={`flex-1 py-3 rounded-xl font-bold transition-colors ${answer === option
                ? "bg-primary text-on-primary"
                : "bg-neutral text-secondary hover:bg-neutral/80"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Votre réponse..."
          rows={5}
          className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ml-12"
        />
      )}
    </div>
  );
}
