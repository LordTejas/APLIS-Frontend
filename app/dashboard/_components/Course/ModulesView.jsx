import React, { useEffect, useState } from 'react';
import { getModules, createModule, updateModule, deleteModule } from '@/actions/modules'; // Assume these actions exist
import useDashboardStore from '../../_zustand/dashboard.zustand';
import useSession from '@/app/hooks/useSession'

const ModulesView = () => {
  const { session } = useSession();
  const { courseId } = useDashboardStore(state => state);
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentModule, setCurrentModule] = useState({ title: '', content: '' });

  const role = session?.user?.role;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchedModules = await getModules(courseId);
        setModules(fetchedModules);
      } catch (error) {
        console.error('Failed to fetch modules:', error);
      }
    };

    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  const handleCreateOrUpdateModule = async () => {
    try {
      if (isEditMode) {
        await updateModule(currentModule); // Implement this action
      } else {
        await createModule({ ...currentModule, courseId }); // Implement this action
      }
      setIsModalOpen(false);
      setCurrentModule({ title: '', content: '' });
      // Refetch modules
      const fetchedModules = await getModules(courseId);
      setModules(fetchedModules);
    } catch (error) {
      console.error('Failed to create/update module:', error);
    }
  };

  const handleEditModule = (module) => {
    setCurrentModule(module);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await deleteModule(moduleId); // Implement this action
      const fetchedModules = await getModules(courseId);
      setModules(fetchedModules);
    } catch (error) {
      console.error('Failed to delete module:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Modules</h1>
      <button
        onClick={() => {
          setIsEditMode(false);
          setIsModalOpen(true);
        }}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Create New Module
      </button>
      <ul>
        {modules.map((module) => (
          <li key={module.id} className="flex justify-between items-center mb-2">
            <span>{module.title}</span>
            <div>
              <button onClick={() => handleEditModule(module)} className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2">
                Edit
              </button>
              <button onClick={() => handleDeleteModule(module.id)} className="bg-red-500 text-white px-2 py-1 rounded-md">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Module' : 'Create New Module'}</h2>
            <input
              type="text"
              placeholder="Module Title"
              value={currentModule.title}
              onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
              className="border p-2 mb-2 w-full"
            />
            <textarea
              placeholder="Module Content"
              value={currentModule.content}
              onChange={(e) => setCurrentModule({ ...currentModule, content: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
            <button
              onClick={handleCreateOrUpdateModule}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {isEditMode ? 'Update Module' : 'Create Module'}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesView;
