import React, { useState } from 'react';
import useDashboardStore from '../../_zustand/dashboard.zustand';
import { createAssignment } from '@/actions/assignments'; // Import the action to create an assignment
import toast from 'react-hot-toast';

const AssignmentCreationView = () => {
  const { courseId, moduleId, setSubMenu } = useDashboardStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState(10);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert dueDate to a Date object
    const dueDateObj = new Date(dueDate);

    try {
      await createAssignment({ title, description, dueDate: dueDateObj, points, courseId, moduleId });
      toast.success('Assignment created successfully!');
      // Reset fields after submission
      setTitle('');
      setDescription('');
      setDueDate('');

      // Take it back to the module content view
      setSubMenu('module-content');

    } catch (error) {
      console.error('Failed to create assignment:', error);
      toast.error('Failed to create assignment.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Assignment</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Points</label>
          <input
            type="number"
            value={points}
            min={0}
            max={10000}
            onChange={(e) => setPoints(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Create Assignment
        </button>
      </form>
    </div>
  );
};

export default AssignmentCreationView;
