import React, { useEffect, useState } from 'react';
import { getEnrolledStudentsByCourse, createEnrollment, deleteEnrollment } from '@/actions/enrollments';
import { getStudentsIdAndUsername } from '@/actions/students';
import useSession from '@/app/hooks/useSession';
import useDashboardStore from '../../_zustand/dashboard.zustand';
import Table from '@/components/Table'; // Import your Table component
import toast from 'react-hot-toast'; // Import toast
import { FaArrowLeft } from "react-icons/fa6";

const EnrollmentsView = () => {
  const { session } = useSession();
  const { courseId, setSubMenu } = useDashboardStore(state => state);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const enrollmentPromises = selectedStudents.map(studentId =>
        createEnrollment(studentId, courseId)
      );

      await Promise.all(enrollmentPromises);
      fetchEnrollments();
      toast.success('Enrollments created successfully!');
      setIsModalOpen(false);
      setSelectedStudents([]);
    } catch (error) {
      console.error('Failed to create enrollment:', error);
      toast.error('Failed to create enrollment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    setLoading(true);
    try {
      await deleteEnrollment(enrollmentId);
      toast.success('Enrollment deleted successfully!');
      fetchEnrollments();
    } catch (error) {
      console.error('Failed to delete enrollment:', error);
      toast.error('Failed to delete enrollment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enrollment table headers
  const enrollmentTableHeaders = new Map([
    ['Student Name', 'username'],
    ['Enrolled On', 'createdAt']
  ]);
  const enrollmentActions = [
    {
      label: 'Delete',
      onAction: handleDeleteEnrollment
    }
  ];
  const enrollmentData = enrollments.map(enrollment => ({
    id: enrollment.id,
    username: enrollment?.student?.username,
    createdAt: new Date(enrollment.createdAt).toLocaleDateString()
  }));

  const enrollableStudents = Array.from(students.entries())
    .filter(([id]) => !enrollments.some(enrollment => enrollment.studentId === id))
    .map(([id, username]) => ({ id, username })) || [];

  const enrollableStudentsHeaderMap = new Map([
    ['Student ID', 'id'],
    ['Student Name', 'username']
  ]);

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center mb-4">
        <button onClick={() => setSubMenu(null)} className="bg-purple-500 text-white px-4 py-2 rounded-md mr-2">
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Enrollments List</h1>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Create New Enrollment'}
      </button>
      <Table
        rows={enrollmentData}
        headersMap={enrollmentTableHeaders}
        actions={enrollmentActions}
      />
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Create New Enrollment</h2>
            <Table
              rows={enrollableStudents}
              headersMap={enrollableStudentsHeaderMap}
              selected={selectedStudents}
              onSelectChange={handleSelectChange}
              selectable={true}
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
