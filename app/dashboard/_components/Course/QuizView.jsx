import React, { useEffect, useState } from 'react';
import useDashboardStore from '../../_zustand/dashboard.zustand';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getQuizById } from '@/actions/quizzes';
import { createSubmission } from '@/actions/submissions';
import useSession from '@/app/hooks/useSession';

const QuizView = () => {
  const { session } = useSession();
  const { setSubMenu, contentId, courseId, moduleId } = useDashboardStore();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const calculateScore = () => {
    return Object.entries(selectedAnswers).reduce((acc, [questionIndex, optionId]) => {
      const question = quiz.questions[questionIndex];
      const selectedOption = question.options.find(o => o.id === optionId);

      return acc + (selectedOption?.isCorrect ? question.points : 0);
    }, 0);
  };

  const handleAnswerSelect = (questionIndex, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionId
    }));
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!contentId) return;
        const fetchedQuiz = await getQuizById(contentId);
        setQuiz(fetchedQuiz);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
        toast.error('Failed to fetch quiz details');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [contentId]);

  const handleSubmit = async () => {
    // Validate all questions are answered
    const unansweredQuestions = quiz.questions.filter((_, index) => !selectedAnswers[index]);

    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions before submitting.`);
      return;
    }

    const calculatedScore = calculateScore();
    setScore(calculateScore);

    try {

      console.log("session", session);

      const isStudent = session?.user?.role === 'STUDENT';
      const userId = session?.user?.id;

      console.log("isStudent", isStudent);
      console.log("userId", userId);
      console.log("courseId", courseId);
      console.log("contentId", contentId);

      if (isStudent && courseId && contentId && userId) {
        await createSubmission({
          courseId,
          moduleId,
          contentId,
          userId: session.user.id,
          contentType: 'QUIZ',
          data: {
            answers: selectedAnswers,
            achivedScore: calculatedScore,
            maxScore: quiz.points
          },
          score: calculatedScore
        });
      } else {
        toast.error('You are not authorized to submit this quiz');
      }

      setSubmitted(true);
      toast.success(`You scored ${calculatedScore} points!`);
      setSubMenu('module-content');
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast.error('Failed to submit quiz.');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!quiz) {
    return <div className="p-4">Quiz not found</div>;
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center mb-4">
        <button
          onClick={() => setSubMenu('module-content')}
          className="bg-purple-500 text-white px-4 py-2 rounded-md mr-2"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Quiz</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{quiz.title}</h2>

        <div className="mb-4">
          <p className="text-gray-600 font-medium">Due Date:</p>
          <p>{quiz.dueDate ? new Date(quiz.dueDate).toLocaleString() : 'No due date'}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 font-medium">Total Points:</p>
          <p>{quiz.points}</p>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={index} className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">
                Question {index + 1}: {question.title}
              </h3>
              {question.description && (
                <p className="text-gray-600 mb-2">{question.description}</p>
              )}
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={selectedAnswers[index] === option.id}
                      onChange={() => handleAnswerSelect(index, option.id)}
                      className="w-4 h-4"
                      disabled={submitted}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`mt-6 px-4 py-2 rounded-md ${submitted
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
        >
          {submitted ? 'Quiz Submitted' : 'Submit Quiz'}
        </button>

        {submitted && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-gray-600 font-medium">Your score: {score} points</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
