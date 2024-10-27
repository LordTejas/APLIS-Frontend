import React, { useEffect, useState } from 'react'
import { getCourses, createCourse, getEnrolledCourses } from '@/actions/courses' // Assume this action exists
import useSession from '@/app/hooks/useSession'
import useDashboardStore from '../../_zustand/dashboard.zustand';
import toast from 'react-hot-toast';
import Table from '@/components/Table'; // Import the Table component

const CoursesView = () => {
  const { session } = useSession()
  const [courses, setCourses] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: '', description: '' })

  const { setCourseId, setSubMenu } = useDashboardStore()

  const role = session?.user?.role || 'STUDENT'

  useEffect(() => {
    if (!session) {
      return
    }

    const fetchCourses = async () => {
      try {
        if (role === 'STUDENT') {
          const enrolledCourses = await getEnrolledCourses(session.user.id);
          setCourses(enrolledCourses);
        } else {
          const courses = await getCourses();
          setCourses(courses);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      }
    }

    fetchCourses()
  }, [session])

  const handleCreateCourse = async () => {
    try {
      await createCourse(newCourse);
      setIsModalOpen(false);
      const courses = await getCourses();
      setCourses(courses);
      toast.success('Course created successfully!'); // Success toast
    } catch (error) {
      console.error('Failed to create course:', error);
      toast.error('Failed to create course. Please try again.'); // Error toast
    }
  }

  const courseActions = [
    {
      label: role === 'STUDENT' ? 'View' : 'Edit',
      bgColor: 'bg-blue-500',
      color: 'text-white',
      onAction: (courseId) => handleEditCourse(courseId),
    },
    ...(role !== 'STUDENT' ? [{
      label: 'Enrollments',
      bgColor: 'bg-purple-500',
      color: 'text-white',
      onAction: (courseId) => handleEnrollments(courseId),
    }] : []),
  ];

  const handleEditCourse = (courseId) => {
    setCourseId(courseId);
    setSubMenu('modules');
  }

  const handleEnrollments = (courseId) => {
    setSubMenu('enrollments');
    setCourseId(courseId);
  }

  const courseHeadersMap = new Map([
    ['Title', 'title'],
    ['Description', 'description'],
    ['Created At', 'createdAt'],
    ['Updated At', 'updatedAt'],
    ['Actions', 'actions'],
  ]);

  const coursesData = courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description?.substring(0, 50),
    createdAt: new Date(course.createdAt).toLocaleDateString(),
    updatedAt: new Date(course.updatedAt).toLocaleDateString(),
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Courses List</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Create New Course
      </button>
      <Table
        rows={coursesData}
        headersMap={courseHeadersMap}
        actions={courseActions}
        recordsPerPage={10}
      />
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Create New Course</h2>
            <input
              type="text"
              placeholder="Course Title"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="border p-2 mb-2 w-full"
            />
            <textarea
              placeholder="Course Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
            <button
              onClick={handleCreateCourse}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Create Course
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

export default CoursesView
