import React, { useEffect, useState } from 'react';
import { getModules, createModule, updateModule, deleteModule } from '@/actions/modules'; // Assume these actions exist
import useDashboardStore from '../../_zustand/dashboard.zustand';
import useSession from '@/app/hooks/useSession';
import Table from '@/components/Table'; // Import the Table component
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const ModulesView = () => {
  const { session } = useSession();
  const { courseId, setSubMenu, setModuleId } = useDashboardStore(state => state);
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentModule, setCurrentModule] = useState({ title: '', description: '' });

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
        await updateModule(currentModule);
      } else {
        await createModule({ ...currentModule, courseId });
      }
      setIsModalOpen(false);
      setCurrentModule({ title: '', content: '' });
      // Refetch modules
      const fetchedModules = await getModules(courseId);
      setModules(fetchedModules);
      toast.success('Module saved successfully!');
    } catch (error) {
      console.error('Failed to create/update module:', error);
      toast.error('Failed to create/update module.');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await deleteModule(moduleId);
      const fetchedModules = await getModules(courseId);
      setModules(fetchedModules);
      toast.success('Module deleted successfully!');
    } catch (error) {
      console.error('Failed to delete module:', error);
      toast.error('Failed to delete module.');
    }
  };

  const moduleHeadersMap = new Map([
    ['Module Name', 'title'],
    ['Description', 'description'],
    ['Created On', 'createdAt'],
  ]);

  const adminTeacherActions = [{
    label: 'Delete',
    bgColor: 'bg-red-500',
    color: 'text-white',
    onAction: handleDeleteModule,
  }];


  const moduleActions = [
    {
      label: 'View',
      bgColor: 'bg-purple-500',
      color: 'text-white',
      onAction: (moduleId) => {
        setModuleId(moduleId);
        setSubMenu('module-content');
      },
    },
    ...(role === 'TEACHER' || role === 'ADMIN' ? adminTeacherActions : []),
  ];

  const modulesData = modules.map(module => ({
    id: module.id,
    title: module.title,
    description: module.description?.length > 50 ? module.description?.substring(0, 50) + '...' : module.description,
    createdAt: module.createdAt.toLocaleDateString(),
  }));

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center mb-4">
        <button onClick={() => setSubMenu(null)} className="bg-purple-500 text-white px-4 py-2 rounded-md mr-2">
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Modules</h1>
      </div>
      <button
        onClick={() => {
          setIsEditMode(false);
          setIsModalOpen(true);
        }}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Create New Module
      </button>
      <Table
        rows={modulesData}
        headersMap={moduleHeadersMap}
        actions={moduleActions}
        recordsPerPage={10}
      />
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
              placeholder="Module Description"
              value={currentModule.description}
              onChange={(e) => setCurrentModule({ ...currentModule, description: e.target.value })}
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
