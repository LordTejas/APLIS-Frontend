import React, { useEffect, useState } from 'react'
import { getCourses, createCourse } from '@/actions/courses' // Assume this action exists
import useSession from '@/app/hooks/useSession'
import useDashboardStore from '../../_zustand/dashboard.zustand';
import { toast } from 'react-hot-toast';

const CoursesView = () => {
  const { session } = useSession()
  const [courses, setCourses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: '', description: '' })

  const { setCourseId, setSubMenu } = useDashboardStore()

  const role = session?.user?.role || 'STUDENT'

  useEffect(() => {
    if (!session) {
      return
    }

    if (session?.user?.role !== 'TEACHER' && session?.user?.role !== 'ADMIN') {
      return
    }

    const fetchCourses = async () => {
      try {
        const courses = await getCourses() // Fetch courses from the server
        setCourses(courses)
        const totalPages = Math.ceil(courses.length / pageSize)
        setTotalPages(totalPages)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      }
    }

    fetchCourses()
  }, [session])

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleCreateCourse = async () => {
    try {
      await createCourse(newCourse);
      setIsModalOpen(false);
      const courses = await getCourses();
      setCourses(courses);
      const totalPages = Math.ceil(courses.length / pageSize);
      setTotalPages(totalPages);
      toast.success('Course created successfully!'); // Success toast
    } catch (error) {
      console.error('Failed to create course:', error);
      toast.error('Failed to create course. Please try again.'); // Error toast
    }
  }

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentCourses = courses.slice(startIndex, endIndex)

  const handleEditCourse = (courseId) => {
    setCourseId(courseId);
    setSubMenu('modules');
  }

  const handleEnrollments = (courseId) => {
    setSubMenu('enrollments');
    setCourseId(courseId);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Courses List</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Create New Course
      </button>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Created At
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Updated At
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {currentCourses.map((course) => (
            <tr key={course.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white" onClick={() => { setCourseId(course.id); setSubMenu('modules') }}>
                {course.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {course.description?.substring(0, 50)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(course.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(course.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={() => handleEditCourse(course.id)}>{session?.user?.role === 'STUDENT' ? 'View' : 'Edit'}</button>
                {role !== 'STUDENT' && <button className='bg-blue-500 text-white px-4 py-2 rounded-md ml-2' onClick={() => handleEnrollments(course.id)}>Enrollments</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

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
