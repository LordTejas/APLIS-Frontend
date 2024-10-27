import React, { useState } from 'react';
import useDashboardStore from '../../_zustand/dashboard.zustand';
import { createModuleContent } from '@/actions/modules';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const ModuleContentCreationView = () => {
  const { courseId, moduleId, setSubMenu } = useDashboardStore();

  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createModuleContent(courseId, moduleId, {
        title,  
        videoUrl,
        content,
        attachments
      });

      toast.success('Module content created successfully!');
      setSubMenu('module-content');
    } catch (error) {
      console.error('Failed to create module content:', error);
      toast.error('Failed to create module content.');
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center mb-4">
        <button 
          onClick={() => setSubMenu('module-content')} 
          className="bg-purple-500 text-white px-4 py-2 rounded-md mr-2"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Create Module Content</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">  
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (Optional)</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter video URL"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-48"
            placeholder="Enter content (HTML or text)"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
          <input
            type="file"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files).map(file => file.name);
              setAttachments(files);
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Create Content
        </button>
      </form>
    </div>
  );
};

export default ModuleContentCreationView;
