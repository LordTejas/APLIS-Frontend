import React, { useEffect, useState } from 'react';
import { getModuleContents } from '@/actions/modules'; // Import the action to fetch module contents
import { getQuizzesByCourseModule } from '@/actions/quizzes';
import { getAssignmentsByCourseModule } from '@/actions/assignments';

import useDashboardStore from '../../_zustand/dashboard.zustand';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

import useSession from '@/app/hooks/useSession';

const ModuleContentView = () => {
  const { session } = useSession();
  const { courseId, moduleId, setSubMenu, setContentId } = useDashboardStore(state => state);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isStudent = session?.user?.role === 'STUDENT';

  useEffect(() => {
    const fetchContents = async () => {
      if (courseId && moduleId) {
        try {
          const fetchedContents = await getModuleContents(courseId, moduleId);
          const fetchedQuizzes = await getQuizzesByCourseModule(courseId, moduleId);
          const fetchedAssignments = await getAssignmentsByCourseModule(courseId, moduleId);
          
          const contentData = [];

          fetchedContents.forEach(content => {
            contentData.push({
              id: content.id,
              contentType: 'CONTENT',
              title: content.title,
              createdAt: content.createdAt,
              updatedAt: content.updatedAt,
            });
          });

          fetchedAssignments.forEach(assignment => {
            contentData.push({
              id: assignment.id,
              contentType: 'ASSIGNMENT',
              title: assignment.title,
              points: assignment.points,
              dueDate: assignment.dueDate,
              description: assignment.description,
            });
          });

          fetchedQuizzes.forEach(quiz => {
            contentData.push({
              id: quiz.id,
              contentType: 'QUIZ',
              title: quiz.title,
              points: quiz.points,
              dueDate: quiz.dueDate,
            });
          });

          setContents(contentData);
        } catch (error) {
          console.error('Failed to fetch module contents:', error);
          toast.error('Failed to fetch module contents.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchContents();
  }, [courseId, moduleId]);

  const handleContentClick = (contentId, contentType) => {
    if (contentType === 'CONTENT') {
      setSubMenu('content-view');
      setContentId(contentId);
    } else if (contentType === 'ASSIGNMENT') {
      setSubMenu('assignment-view');
      setContentId(contentId);
    } else if (contentType === 'QUIZ') {
      setSubMenu('quiz-view');
      setContentId(contentId);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center mb-4">
        <button onClick={() => setSubMenu('modules')} className="bg-purple-500 text-white px-4 py-2 rounded-md mr-2">
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Module Contents</h1>
      </div>

      {/* Create Assignment and Quiz Buttons */}
      {!isStudent && <div className="flex gap-2">
        <button onClick={() => setSubMenu('module-content-creation')} className="bg-slate-800 text-white px-4 py-2 rounded-md">Create Content</button>
        <button onClick={() => setSubMenu('assignment-creation')} className="bg-orange-500 text-white px-4 py-2 rounded-md">Create Assignment</button>
          <button onClick={() => setSubMenu('quiz-creation')} className="bg-purple-500 text-white px-4 py-2 rounded-md">Create Quiz</button>
        </div>
      }

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-justify">Type</th>
              <th className="px-4 py-2 text-start">Title</th>
              <th className="px-4 py-2 text-start">Points</th>
              <th className="px-4 py-2 text-start">Due Date</th>
              <th className="px-4 py-2 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((content) => (
              <tr key={content.id} className={content.contentType === 'ASSIGNMENT' ? 'bg-orange-300' : content.contentType === 'QUIZ' ? 'bg-purple-300' : 'bg-slate-300'}>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 text-xs font-bold text-white rounded ${content.contentType === 'ASSIGNMENT' ? 'bg-orange-600' : content.contentType === 'QUIZ' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                    {content.contentType}
                  </span>
                </td>
                <td className="px-4 py-2">{content.title || 'N/A'}</td>
                <td className="px-4 py-2">{content.points || 'N/A'}</td>
                <td className="px-4 py-2">{content.dueDate ? new Date(content.dueDate).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleContentClick(content.id, content.contentType)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ModuleContentView;
