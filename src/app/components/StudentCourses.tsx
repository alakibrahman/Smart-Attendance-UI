import { useState } from 'react';
import { BookOpen, ChevronRight, Link } from 'lucide-react';
import { Course } from '../types';

interface StudentCoursesProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onJoinCourse: (courseId: string, studentName: string, studentRoll: string) => void;
}

export function StudentCourses({ courses, onSelectCourse, onJoinCourse }: StudentCoursesProps) {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinLink, setJoinLink] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleJoinCourse = () => {
    const courseIdMatch = joinLink.trim().match(/\/enroll\/(\w+)/);
    if (!courseIdMatch) {
      setJoinError('Invalid join link format. Please use a link like: https://attendance.app/enroll/COURSE_ID');
      return;
    }

    if (!studentName.trim() || !studentRoll.trim()) {
      setJoinError('Name and roll number are required.');
      return;
    }

    const courseId = courseIdMatch[1];
    const course = courses.find(c => c.id === courseId);

    if (!course) {
      setJoinError('Course not found. Please check the join link.');
      return;
    }

    onJoinCourse(courseId, studentName.trim(), studentRoll.trim());
    setJoinLink('');
    setStudentName('');
    setStudentRoll('');
    setShowJoinForm(false);
    setJoinError('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
        <button
          onClick={() => setShowJoinForm(!showJoinForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Link className="w-4 h-4" />
          <span>Join Course</span>
        </button>
      </div>

      {showJoinForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Join a Course</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="joinLink" className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Link
              </label>
              <input
                id="joinLink"
                type="text"
                value={joinLink}
                onChange={(e) => setJoinLink(e.target.value)}
                placeholder="https://attendance.app/enroll/COURSE_ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="studentRoll" className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number
              </label>
              <input
                id="studentRoll"
                type="text"
                value={studentRoll}
                onChange={(e) => setStudentRoll(e.target.value)}
                placeholder="Your roll number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {joinError && (
              <p className="text-red-600 text-sm mt-2">{joinError}</p>
            )}
            <div className="flex space-x-3">
              <button
                onClick={handleJoinCourse}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Join Course
              </button>
              <button
                onClick={() => {
                  setShowJoinForm(false);
                  setJoinLink('');
                  setJoinError('');
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => onSelectCourse(course.id)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
            <p className="text-sm text-gray-500">{course.code}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
