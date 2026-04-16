import { BarChart3, BookOpen, Home } from 'lucide-react';
import { Course } from '../types';

interface StudentDashboardProps {
  courses: Course[];
  onNavigate: (view: 'courses' | 'dashboard') => void;
  currentView: 'courses' | 'dashboard';
  onLogout: () => void;
  children?: React.ReactNode;
}

export function StudentDashboard({ courses, onNavigate, currentView, onLogout, children }: StudentDashboardProps) {
  const calculateAttendancePercentage = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.attendanceRecords) return 0;

    const totalClasses = course.attendanceRecords.length;
    if (totalClasses === 0) return 0;

    const presentClasses = course.attendanceRecords.filter(record => record.present).length;
    return Math.round((presentClasses / totalClasses) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
          <button
            onClick={onLogout}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => onNavigate('courses')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                currentView === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Courses</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                currentView === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'courses' && children}
        {currentView === 'dashboard' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const percentage = calculateAttendancePercentage(course.id);
                return (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">{course.name}</h3>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Attendance</span>
                        <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {course.attendanceRecords?.length || 0} classes recorded
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
