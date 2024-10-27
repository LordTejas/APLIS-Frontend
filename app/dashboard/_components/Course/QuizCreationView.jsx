import React, { useState } from 'react';
import useDashboardStore from '../../_zustand/dashboard.zustand';
import { createQuiz } from '@/actions/quizzes';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { nanoid } from 'nanoid';

const QuizCreationView = () => {
  const { courseId, moduleId, setSubMenu } = useDashboardStore();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState(10);
  const [questions, setQuestions] = useState([{
    title: '',
    description: '',
    points: 1,
    options: [{
      id: nanoid(10),
      label: '',
      isCorrect: false,
      image: ''
    }]
  }]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate at least one correct answer per question
    const isValid = questions.every(question =>
      question.options.some(option => option.isCorrect)
    );

    if (!isValid) {
      toast.error('Each question must have at least one correct answer.');
      return;
    }

    try {
      await createQuiz({
        title,
        courseId,
        moduleId,
        dueDate: new Date(dueDate),
        points,
        questions: questions
      });

      toast.success('Quiz created successfully!');
      setSubMenu('module-content');
    } catch (error) {
      console.error('Failed to create quiz:', error);
      toast.error('Failed to create quiz.');
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      title: '',
      description: '',
      points: 1,
      options: [{
        id: nanoid(10),
        label: '',
        isCorrect: false,
        image: ''
      }]
    }]);
  };

  const removeQuestion = (questionIndex) => {
    setQuestions(questions.filter((_, index) => index !== questionIndex));
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      id: nanoid(10),
      label: '',
      isCorrect: false,
      image: ''
    });
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options =
      updatedQuestions[questionIndex].options.filter((_, index) => index !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const updateQuestion = (questionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAutoCalculatePoints = async () => {
    try {
      const totalPoints = questions.reduce((sum, question) => sum + question.points, 0);
      setPoints(totalPoints);
    } catch (error) {
      console.error('Failed to auto calculate points:', error);
      toast.error('Failed to auto calculate points.');
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center mb-4">
        <button onClick={() => setSubMenu('module-content')} className="bg-purple-500 text-white px-4 py-2 rounded-md mr-2">
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Create Quiz</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz Title"
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="p-4 border rounded space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Question {questionIndex + 1}</h3>
              <button
                type="button"
                onClick={() => removeQuestion(questionIndex)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>

            <input
              type="text"
              value={question.title}
              onChange={(e) => updateQuestion(questionIndex, 'title', e.target.value)}
              placeholder="Question Title"
              required
              className="w-full p-2 border rounded"
            />

            <textarea
              value={question.description}
              onChange={(e) => updateQuestion(questionIndex, 'description', e.target.value)}
              placeholder="Question Description"
              className="w-full p-2 border rounded"
            />

            <input
              type="number"
              value={question.points}
              onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value))}
              min="1"
              placeholder="Points"
              required
              className="w-full p-2 border rounded"
            />

            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => updateOption(questionIndex, optionIndex, 'label', e.target.value)}
                    placeholder="Option Label"
                    required
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) => updateOption(questionIndex, optionIndex, 'isCorrect', e.target.checked)}
                    className="w-6 h-6"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(questionIndex, optionIndex)}
                    className="text-red-500"
                    disabled={question.options.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(questionIndex)}
                className="flex items-center space-x-2 text-blue-500"
              >
                <FaPlus /> <span>Add Option</span>
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center space-x-2 text-blue-500"
        >
          <FaPlus /> <span>Add Question</span>
        </button>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Points</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            min={0}
            max={10000}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          <button type="button" onClick={handleAutoCalculatePoints} className="mt-1 block w-full bg-blue-500 text-white px-4 py-2 rounded-md">Auto Calculate Points</button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizCreationView;
