import React, { useEffect, useState } from 'react';
import { getModuleContent } from '@/actions/modules';
import { createSubmission } from '@/actions/submissions';
import useDashboardStore from '../../_zustand/dashboard.zustand';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import useSession from '@/app/hooks/useSession';

const ModuleContentReadView = () => {
  const { session } = useSession();
  const { courseId, moduleId, setSubMenu, contentId } = useDashboardStore();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleMarkAsCompleted = async () => {
    try {

      const isStudent = session?.user?.role === 'STUDENT';
      const userId = session?.user?.id;

      if (isStudent && courseId && moduleId && contentId && userId) {
        await createSubmission({
          courseId,
          moduleId,
          contentId,
          userId,
          contentType: 'CONTENT',
          data: {
            title: content.title,
            completed: true
          },
          score: 10 // Kept Score (Final Score)
        });
        toast.success('Content marked as completed!');
      } else {
        toast.error('You are not authorized to mark this content as completed');
      }
    } catch (error) {
      console.error('Failed to mark content as completed:', error);
      toast.error('Failed to mark content as completed');
    }
  }

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const content = await getModuleContent(contentId);
        setContent(content);
      } catch (error) {
        console.error('Failed to fetch content:', error);
        toast.error('Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchContent();
    }
  }, [courseId, moduleId, contentId]);

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center mb-4">
        <button 
          onClick={() => setSubMenu('module-content')} 
          className="bg-purple-500 text-white px-4 py-2 rounded-md mr-2"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">{loading ? 'Loading...' : content.title}</h1>
      </div>

      {loading && <div className="p-4">Loading...</div>}

      <div className="space-y-6">
        {/* Video Section */}
        {!loading && content.videoUrl && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Video Content</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={content.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[400px] rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Text/HTML Content Section */}
        {!loading && content.content && (
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">Content</h2>
            <div 
              dangerouslySetInnerHTML={{ __html: content.content }}
              className="bg-white p-4 rounded-lg shadow"
            />
          </div>
        )}

        {/* Attachments Section */}
        {!loading && content.attachments && content.attachments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Attachments</h2>
            <ul className="list-disc pl-5">
              {content.attachments.map((attachment, index) => (
                <li key={index} className="text-blue-500 hover:text-blue-700">
                  <a href={attachment} target="_blank" rel="noopener noreferrer">
                    {attachment.split('/').pop()} {/* Display filename */}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mark as Completed Button */}
        {!loading && session?.user?.role === 'STUDENT' && (
          <button onClick={handleMarkAsCompleted} className="bg-purple-500 text-white px-4 py-2 rounded-md">Mark as Completed</button>
        )}

      </div>
    </div>
  );
};

export default ModuleContentReadView;
