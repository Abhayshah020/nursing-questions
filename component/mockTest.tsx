"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, FileText, Award, LogOut, ChevronRight } from "lucide-react";
import axiosClient from "@/utils/axiosClient";

function LoadingView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-blue-100 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 relative">
            <FileText className="w-10 h-10 text-blue-600" />
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Loading Mock Test
          </h3>
          <p className="text-gray-600 mb-6">
            Please wait while we prepare your questions...
          </p>
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoQuestionsView({ handleExitTest }: { handleExitTest: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-blue-100 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No Questions Available
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any questions for this test. Please try again later or contact support.
          </p>
          <button
            onClick={handleExitTest}
            className="bg-gradient-to-r cursor-pointer from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function ExitConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-blue-100">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <LogOut className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Exit Mock Test?</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to exit? All your progress will be lost and you won't be able to resume this test.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
          >
            Exit Test
          </button>
        </div>
      </div>
    </div>
  );
}

type ResultCardProps = {
  label: string;
  value: string | number;
  color?: "blue" | "green" | "red";
};

export function ResultCard({
  label,
  value,
  color = "blue",
}: ResultCardProps) {
  const colorMap = {
    blue: {
      bg: "from-blue-50 to-blue-100",
      text: "text-blue-700",
      ring: "ring-blue-200",
    },
    green: {
      bg: "from-green-50 to-green-100",
      text: "text-green-700",
      ring: "ring-green-200",
    },
    red: {
      bg: "from-red-50 to-red-100",
      text: "text-red-700",
      ring: "ring-red-200",
    },
  };

  const styles = colorMap[color];

  return (
    <div
      className={`
        bg-gradient-to-br ${styles.bg}
        rounded-xl p-6 text-center
        shadow-md ring-1 ${styles.ring}
        hover:shadow-lg transition-shadow
      `}
    >
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-4xl font-bold ${styles.text}`}>{value}</p>
    </div>
  );
}


export default function MockTestView({ group, setShowTest, startMockTest }: { startMockTest: () => void, group: any, setShowTest: (data: boolean) => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number | null }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timerInitialized, setTimerInitialized] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);

  const TEST_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  const START_TIME_KEY = `mockTest_${group?.id}_startTime`;
  const ANSWERS_KEY = `mockTest_${group?.id}_answers`;
  const CURRENT_INDEX_KEY = `mockTest_${group?.id}_currentIndex`;

  useEffect(() => {
    if (!group) return;

    const savedStartTime = sessionStorage.getItem(START_TIME_KEY);
    const savedAnswers = sessionStorage.getItem(ANSWERS_KEY);
    const savedIndex = sessionStorage.getItem(CURRENT_INDEX_KEY);

    let startTime: number;
    if (savedStartTime) {
      startTime = parseInt(savedStartTime);
    } else {
      startTime = Date.now();
      sessionStorage.setItem(START_TIME_KEY, startTime.toString());
    }

    const elapsed = Date.now() - startTime;
    const remaining = TEST_DURATION - elapsed;
    const remainingSeconds = Math.max(0, Math.floor(remaining / 1000));

    setTimeRemaining(remainingSeconds);
    setTimerInitialized(true); // ✅ VERY IMPORTANT

    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex));
  }, [group]);

  useEffect(() => {
    if (!timerInitialized) return;
    if (examResult) return;
    if (timeRemaining <= 0) {
      handleAutoSubmit(answers);
      return;
    }

    const timer = setInterval(() => {
      const savedStartTime = sessionStorage.getItem(START_TIME_KEY);
      if (!savedStartTime) return;

      const startTime = parseInt(savedStartTime);
      const elapsed = Date.now() - startTime;
      const remaining = TEST_DURATION - elapsed;
      const remainingSeconds = Math.max(0, Math.floor(remaining / 1000));

      setTimeRemaining(remainingSeconds);

      if (remainingSeconds <= 0) {
        handleAutoSubmit(answers);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timerInitialized, timeRemaining, examResult]);


  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = async (answers: any) => {
    if (!group) return;
    if (submitting) return; // guard

    setSubmitting(true);

    try {
      const questions = group.questions;

      /* ------------------------------
         Calculate score
      -------------------------------*/
      let totalScore = 0;

      const formattedAnswers = questions.map((q: any) => {
        const selectedOptionId = answers[q.id];

        const selectedOption = q.options.find(
          (o: any) => o.id === selectedOptionId
        );

        if (selectedOption?.isCorrect) {
          totalScore += 1;
        }

        return {
          questionId: q.id,
          selectedOption: String(selectedOptionId),
        };
      });

      const savedStartTime = sessionStorage.getItem(START_TIME_KEY);
      const startTime = savedStartTime
        ? parseInt(savedStartTime)
        : Date.now();

      const durationMs = Date.now() - startTime;

      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

      const completedTimeframe = `${hours}h ${minutes}m ${seconds}s`;

      const { data } = await axiosClient.post("/exam-result", {
        questionGroupId: group.id,
        totalScore,
        completedTimeframe,
        answers: formattedAnswers,
      });
      setExamResult(data.data);

      sessionStorage.removeItem(START_TIME_KEY);
      sessionStorage.removeItem(ANSWERS_KEY);
      sessionStorage.removeItem(CURRENT_INDEX_KEY);
      sessionStorage.removeItem("mockTestQuestions")
      sessionStorage.removeItem("takeMockTest")
    } catch (error) {
      console.error("Auto submit failed:", error);
      setSubmitting(false);
    }
  };


  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const currentQuestion = group.questions[currentQuestionIndex];
    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOption };

    setAnswers(updatedAnswers);
    sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(updatedAnswers));

    if (currentQuestionIndex < group.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      sessionStorage.setItem(CURRENT_INDEX_KEY, nextIndex.toString());

      const nextQuestion = group.questions[nextIndex];
      setSelectedOption(updatedAnswers[nextQuestion.id] || null);
    } else {
      handleAutoSubmit(updatedAnswers);
    }
  };

  const handleExitTest = () => {
    sessionStorage.removeItem(START_TIME_KEY);
    sessionStorage.removeItem(ANSWERS_KEY);
    sessionStorage.removeItem(CURRENT_INDEX_KEY);
    sessionStorage.removeItem("mockTestQuestions")
    sessionStorage.removeItem("takeMockTest")
    setShowTest(false)
  };

  if (!group) {
    return <LoadingView />;
  }

  if (!group.questions || group.questions.length === 0) {
    return <NoQuestionsView handleExitTest={handleExitTest} />;
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = group.questions.length;
  const currentQuestion = group.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  if (examResult) {
    const { summary, review } = examResult;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
        {showExitModal && (
          <ExitConfirmModal
            onConfirm={handleExitTest}
            onCancel={() => setShowExitModal(false)}
          />
        )}
        <div className="max-w-4xl mx-auto px-6">
          {/* Result Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Test Completed
              </h2>
              <p className="text-gray-600">
                Time Taken: {summary.completedTimeframe}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <ResultCard label="Correct" value={summary.correctCount} color="green" />
              <ResultCard label="Incorrect" value={summary.incorrectCount} color="red" />
              <ResultCard label="Total Questions" value={summary.totalQuestions} color="blue" />
            </div>
          </div>

          {/* Answer Review */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Answer Review</h3>

            {review.map((res: any, index: number) => {
              const selectedOption = res.question.options.find(
                (o: any) => String(o.id) === String(res.selectedOption)
              );
              const correctOption = res.question.options.find(
                (o: any) => o.isCorrect
              );

              return (
                <div
                  key={res.questionId}
                  className="bg-white rounded-xl shadow-md border p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${res.isCorrect ? "bg-green-100" : "bg-red-100"
                      }`}>
                      {res.isCorrect ? (
                        <CheckCircle className="text-green-600 w-5 h-5" />
                      ) : (
                        <XCircle className="text-red-600 w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">
                        {index + 1}. {res.question.question}
                      </h4>

                      <p className="text-sm">
                        <span className="font-medium">Your Answer:</span>{" "}
                        <span className={res.isCorrect ? "text-green-600" : "text-red-600"}>
                          {selectedOption?.text || "Not Answered"}
                        </span>
                      </p>

                      {!res.isCorrect && (
                        <p className="text-sm">
                          <span className="font-medium">Correct Answer:</span>{" "}
                          <span className="text-green-600">
                            {correctOption?.text}
                          </span>
                        </p>
                      )}

                      <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                        <p className="text-sm text-gray-700">
                          {res.question.description || "No explanation provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => setShowExitModal(true)}
              className="bg-red-50 cursor-pointer hover:bg-red-100 text-red-600 px-5 py-2 rounded-lg font-semibold"
            >
              Exit
            </button>
            <button
              onClick={() => {
                startMockTest();
              }}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Take Another Test
            </button>
          </div>

        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      {showExitModal && (
        <ExitConfirmModal
          onConfirm={handleExitTest}
          onCancel={() => setShowExitModal(false)}
        />
      )}

      <div className="max-w-4xl mx-auto px-6">
        {/* Header with Timer and Exit */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{group.title}</h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className={`font-mono text-lg font-semibold ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-700'
                  }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <button
                onClick={() => setShowExitModal(true)}
                className="flex items-center cursor-pointer  gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Exit Test</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-blue-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Answered: {answeredCount} / {totalQuestions}
              </span>
              <span className="text-xs font-semibold text-blue-700">
                {((answeredCount / totalQuestions) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <h3 className="font-bold text-gray-800 text-xl mb-6">
            {currentQuestion.question}
          </h3>

          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((opt: any) => {
              const isSelected = selectedOption === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={isSelected}
                    onChange={() => setSelectedOption(opt.id)}
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className={`text-gray-700 text-lg ${isSelected ? "font-semibold" : ""}`}>
                    {opt.text}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null || submitting}
              className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  {isLastQuestion ? "Submit Test" : "Next Question"}
                  {!isLastQuestion && <ChevronRight className="w-5 h-5" />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}