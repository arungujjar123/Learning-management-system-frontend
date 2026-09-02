import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useLearningTimer from "../../helper/customHooks/useLearningTimer";
import {
  FaBrain,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTrophy,
} from "react-icons/fa";

const Quiz = () => {
  const { courseId, chapterId, topicId } = useParams();
  const token = localStorage.getItem("token");

  const [quiz, setQuiz] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [answerQuiz, setAnswerQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [result, setResult] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { startTimer, stopTimer, formattedTime } = useLearningTimer();

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  useEffect(() => {
    async function getCourseById() {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(
          `${backendUrl}/student/courses/${courseId}`
        );
        const courseResponse = await response.json();

        if (response.ok && courseResponse.success) {
          const chapter = courseResponse.data.chapters.find(
            (c) => c._id === chapterId
          );
          const topic = chapter?.topics.find((t) => t._id === topicId);
          if (topic?.quiz) {
            setQuiz(topic.quiz);
          }
          setQuizTitle(courseResponse.data.title);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    }

    getCourseById();
  }, [courseId, chapterId, topicId]);

  const handleTickOption = (questionIdx, option) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIdx] = option;
      return newAnswers;
    });
    setAnswerQuiz((prev) => {
      const updated = prev.filter(
        (ans) => ans.question !== quiz[questionIdx].question
      );
      return [
        ...updated,
        { question: quiz[questionIdx].question, tickOption: option },
      ];
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const bodyData = {
      courseId,
      chapterId,
      topicId,
      answerQuiz,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/student/quiz_submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data.data);
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  if (!isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 font-sans">
        {/* Timer Bar */}
        <div className="flex items-center justify-between bg-cyan-50 border border-cyan-200 px-5 py-3 rounded-2xl">
          <div className="flex items-center gap-2.5 text-cyan-900 font-bold text-xs sm:text-sm">
            <FaBrain className="text-cyan-600" />
            <span>Focus Mode</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-800 font-extrabold text-xs sm:text-sm">
            <FaClock size={12} />
            <span>Time: {formattedTime}</span>
          </div>
        </div>

        {/* Title & Progress */}
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {quizTitle ? `Quiz: ${quizTitle}` : "Topic Quiz"}
          </h2>
          {quiz.length > 0 && (
            <div className="space-y-1 max-w-xs mx-auto">
              <p className="text-xs font-semibold text-slate-500">
                Question {currentQuestionIndex + 1} of {quiz.length}
              </p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Question Card */}
        {quiz.length > 0 ? (
          <form
            onSubmit={handleOnSubmit}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQuestionIndex + 1}. {quiz[currentQuestionIndex].question}
              </h3>

              <div className="space-y-2.5">
                {quiz[currentQuestionIndex].options.map((option, optionIdx) => {
                  const isSelected =
                    userAnswers[currentQuestionIndex] === option;
                  return (
                    <div
                      key={optionIdx}
                      onClick={() =>
                        handleTickOption(currentQuestionIndex, option)
                      }
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-cyan-50 border-cyan-600 text-cyan-950 font-bold shadow-xs"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700 font-medium"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() =>
                          handleTickOption(currentQuestionIndex, option)
                        }
                        name={`question-${currentQuestionIndex}`}
                        className="accent-cyan-600"
                      />
                      <span className="text-sm">{option}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors shadow-xs"
              >
                <FaArrowLeft size={11} />
                <span>Previous</span>
              </button>

              {currentQuestionIndex < quiz.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(quiz.length - 1, prev + 1)
                    )
                  }
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-600/20 transition-all"
                >
                  <span>Next</span>
                  <FaArrowRight size={11} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <span>Finish & Submit</span>
                  <FaCheckCircle size={12} />
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center text-slate-500 text-sm font-medium shadow-xs">
            No quiz questions found for this topic.
          </div>
        )}
      </div>
    );
  }

  // Submitted Score View
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 font-sans">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-xs border border-emerald-200">
          <FaTrophy />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Quiz Completed!</h2>

        <div className="p-4 rounded-2xl bg-slate-50 max-w-sm mx-auto border border-slate-200/80">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Your Result
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 pt-1">
            {result.score}%
          </p>
          <p className="text-xs text-slate-600 font-medium">
            {result.correct} of {result.totalQuestions} Questions Correct
          </p>
        </div>

        <div className="pt-2">
          <Link
            to={`/student/courses/${courseId}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-600/20 transition-all"
          >
            <FaArrowLeft size={11} />
            <span>Return to Course</span>
          </Link>
        </div>
      </div>

      {/* Answer Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Detailed Review</h3>
        <div className="space-y-4">
          {result?.quiz?.map((q, qidx) => {
            const isCorrect = q.tickOption === q.correctOption;
            return (
              <div
                key={qidx}
                className={`p-6 rounded-2xl border ${
                  isCorrect
                    ? "bg-emerald-50/30 border-emerald-200/80"
                    : "bg-red-50/30 border-red-200/80"
                } space-y-3`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <FaCheckCircle className="text-emerald-500 mt-1 shrink-0 text-base" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mt-1 shrink-0 text-base" />
                  )}
                  <h4 className="text-sm font-bold text-slate-900">
                    Q{qidx + 1}. {q.questionText}
                  </h4>
                </div>

                <div className="pl-7 space-y-1.5 text-xs">
                  <p className="text-slate-700">
                    <strong>Your Answer:</strong>{" "}
                    <span
                      className={
                        isCorrect
                          ? "text-emerald-700 font-semibold"
                          : "text-red-700 font-semibold"
                      }
                    >
                      {q.tickOption || "Not answered"}
                    </span>
                  </p>
                  <p className="text-slate-700">
                    <strong>Correct Answer:</strong>{" "}
                    <span className="text-emerald-700 font-semibold">
                      {q.correctOption}
                    </span>
                  </p>
                  {q.explaination && (
                    <p className="text-slate-500 pt-1 border-t border-slate-200/60">
                      <strong>Explanation:</strong> {q.explaination}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

