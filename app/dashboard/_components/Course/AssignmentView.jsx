import React, { useEffect, useState } from 'react';
import useDashboardStore from '../../_zustand/dashboard.zustand';
import { FaArrowLeft } from 'react-icons/fa';
import { getAssignmentById } from '@/actions/assignments';
import { createSubmission } from '@/actions/submissions';
import toast from 'react-hot-toast';
import useSession from '@/app/hooks/useSession';

const AssignmentView = () => {
  const { session } = useSession();
  const { setSubMenu, contentId, courseId, moduleId } = useDashboardStore();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState('');
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        if (!contentId) return;

        const fetchedAssignment = await getAssignmentById(contentId);
        setAssignment(fetchedAssignment);
      } catch (error) {
        console.error('Failed to fetch assignment:', error);
        toast.error('Failed to fetch assignment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [contentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const isStudent = session?.user?.role === 'STUDENT';
      const userId = session?.user?.id;

      if (isStudent && courseId && contentId && userId) {
        const res = await createSubmission({
          courseId,
          moduleId: moduleId || null,
          contentId,
          contentType: 'ASSIGNMENT',
          userId,
          data: {
            submission: submission,
            score: 10 // Submission score
          },
          score: 10 // Kept Score (Final Score)
        });
        toast.success('Assignment submitted successfully!');
      } else {
        toast.error('You are not authorized to submit this assignment');
      }
      setSubMenu('module-content');
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      toast.error('Failed to submit assignment');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!assignment) {
    return <div className="p-4">Assignment not found</div>;
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
        <h1 className="text-2xl font-bold">Assignment Details</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{assignment.title}</h2>

        <div className="mb-4">
          <p className="text-gray-600 font-medium">Due Date:</p>
          <p>{new Date(assignment.dueDate).toLocaleString()}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 font-medium">Points:</p>
          <p>{assignment.points}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 font-medium">Description:</p>
          <p className="whitespace-pre-wrap">{assignment.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Your Submission</label>
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-32"
              placeholder="Enter your submission here..."
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Attachments</label>
            <input
              type="file"
              multiple
              onChange={(e) => setAttachments(e.target.files)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            />
            <p className="mt-1 text-xs text-gray-500">You can upload multiple files.</p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit Assignment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentView;
