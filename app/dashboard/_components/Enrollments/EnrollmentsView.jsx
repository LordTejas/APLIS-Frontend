import React, { useEffect, useState } from 'react';
import { getEnrolledStudentsByCourse, createEnrollment, deleteEnrollment } from '@/actions/enrollments';
import { getStudentsIdAndUsername } from '@/actions/students';
import useSession from '@/app/hooks/useSession';
import useDashboardStore from '../../_zustand/dashboard.zustand';
import Table from '@/components/Table'; // Import your Table component
import toast from 'react-hot-toast'; // Import toast

const EnrollmentsView = () => {
  const { session } = useSession();
  const { courseId } = useDashboardStore(state => state);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]); // State for selected students
  const [loading, setLoading] = useState(false); // State for loading status

  const enrollableStudents = Array.from(students.entries()).map(([id, username]) => ({ id, username })) || [];
  const headerMap = new Map([
    ['Student ID', 'id'],
    ['Student Name', 'username']
  ]);

  const handleSelectChange = (selectedIds) => {
    setSelectedStudents(Array.from(selectedIds));
  };

  const fetchStudents = async () => {
    const fetchedStudents = await getStudentsIdAndUsername();
    setStudents(new Map(fetchedStudents.map(student => [student.id, student.username])));
  };

  const fetchEnrollments = async () => {
    if (courseId) {
      const fetchedEnrollments = await getEnrolledStudentsByCourse(courseId);
      setEnrollments(fetchedEnrollments);
      fetchStudents();
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [courseId]);

  const handleCreateEnrollment = async () => {
    setLoading(true); // Set loading to true when the action starts
    try {
      const enrollmentPromises = selectedStudents.map(studentId => 
        createEnrollment(studentId, courseId)
      );

      const res = await Promise.all(enrollmentPromises); // Bulk create enrollments
      fetchEnrollments();
      toast.success('Enrollments created successfully!'); // Success toast
      setIsModalOpen(false);
      setSelectedStudents([]); // Clear selected students
    } catch (error) {
      console.error('Failed to create enrollment:', error);
      toast.error('Failed to create enrollment. Please try again.'); // Error toast
    } finally {
      setLoading(false); // Set loading to false after the action completes
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    setLoading(true); // Set loading to true when the action starts
    try {
      await deleteEnrollment(enrollmentId);
      toast.success('Enrollment deleted successfully!'); // Success toast
      fetchEnrollments(); // Refresh enrollments
    } catch (error) {
      console.error('Failed to delete enrollment:', error);
      toast.error('Failed to delete enrollment. Please try again.'); // Error toast
    } finally {
      setLoading(false); // Set loading to false after the action completes
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enrollments List</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
        disabled={loading} // Disable button when loading
      >
        {loading ? 'Loading...' : 'Create New Enrollment'}
      </button>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Student ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Student Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Enrolled On
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {enrollment.studentId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {enrollment?.student?.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(enrollment.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <button
                  className='bg-red-500 text-white px-4 py-2 rounded-md'
                  onClick={() => handleDeleteEnrollment(enrollment.id)}
                  disabled={loading} // Disable button when loading
                >
                  {loading ? 'Loading...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Create New Enrollment</h2>
            <Table 
              rows={enrollableStudents}
              headersMap={headerMap}
              selected={selectedStudents}
              onSelectChange={handleSelectChange}
              selectable
            />
            <button
              onClick={handleCreateEnrollment}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Create Enrollment
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

export default EnrollmentsView;
