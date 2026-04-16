import { BookOpen, ChevronRight, Plus } from 'lucide-react';
import { Course } from '../types';

interface TeacherCoursesProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onAddCourse: () => void;
  onLogout: () => void;
}

export function TeacherCourses({ courses, onSelectCourse, onAddCourse, onLogout }: TeacherCoursesProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Portal</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={onAddCourse}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
            <button
              onClick={onLogout}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{course.code}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{course.enrolledStudents?.length || 0} students</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
