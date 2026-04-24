import { useState } from 'react';
import { ArrowLeft, Bluetooth, Hash, CheckCircle, Clock } from 'lucide-react';
import { Course } from '../types';

interface StudentCourseDetailProps {
  course: Course;
  onBack: () => void;
  onSubmitAttendance: (courseId: string, method: string, value: string) => void;
  attendanceStatus: 'idle' | 'pending' | 'approved';
}

export function StudentCourseDetail({ course, onBack, onSubmitAttendance, attendanceStatus }: StudentCourseDetailProps) {
  const [code, setCode] = useState('');

  const handleBluetoothConnect = () => {
    // Simulate Bluetooth connection for demo
    onSubmitAttendance(course.id, 'bluetooth', 'mock-bluetooth-connection');
  };

  const handleCodeSubmit = () => {
    if (code.trim()) {
      onSubmitAttendance(course.id, 'code', code);
      setCode('');
    }
  };

  if (attendanceStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Attendance Marked!</h2>
          <p className="text-gray-600 mb-6">
            Your attendance has been successfully recorded.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
          <p className="text-sm text-gray-600">{course.code}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Mark Attendance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleBluetoothConnect}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md hover:border-indigo-300 transition-all group"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
              <Bluetooth className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Bluetooth</h3>
            <p className="text-sm text-gray-600">Connect via Bluetooth</p>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Hash className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-4">Enter Code</h3>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleCodeSubmit}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!code.trim()}
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
