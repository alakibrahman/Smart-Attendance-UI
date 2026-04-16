import { useState, useEffect } from 'react';
import { ArrowLeft, QrCode, Bluetooth, Hash, UserPlus, Download, Users, CheckCircle, UserCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Course, AttendanceRequest, Student } from '../types';

interface TeacherCourseDetailProps {
  course: Course;
  onBack: () => void;
  attendanceRequests: AttendanceRequest[];
  onApproveAttendance: () => void;
  onToggleStudentPresence: (studentId: string) => void;
  onManualAttendance: (selectedStudents: { studentId: string; present: boolean }[]) => void;
}

export function TeacherCourseDetail({
  course,
  onBack,
  attendanceRequests,
  onApproveAttendance,
  onToggleStudentPresence,
  onManualAttendance
}: TeacherCourseDetailProps) {
  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'bluetooth' | 'code' | 'manual'>('qr');
  const [manualAttendance, setManualAttendance] = useState<{ [studentId: string]: boolean }>({});
  const [qrCode, setQrCode] = useState('');
  const [attendanceCode, setAttendanceCode] = useState('');
  const [showEnrollLink, setShowEnrollLink] = useState(false);

  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  useEffect(() => {
    setQrCode(generateRandomCode());
    setAttendanceCode(generateRandomCode());

    const interval = setInterval(() => {
      setQrCode(generateRandomCode());
      setAttendanceCode(generateRandomCode());
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedMethod === 'manual' && course.enrolledStudents) {
      const initialAttendance: { [studentId: string]: boolean } = {};
      course.enrolledStudents.forEach((student) => {
        initialAttendance[student.id] = false;
      });
      setManualAttendance(initialAttendance);
    }
  }, [selectedMethod, course.enrolledStudents]);

  const handleManualAttendanceSubmit = () => {
    const selectedStudents = Object.entries(manualAttendance).map(([studentId, present]) => ({
      studentId,
      present,
    }));
    onManualAttendance(selectedStudents);
    setManualAttendance({});
  };

  const enrollLink = `https://attendance.app/enroll/${course.id}`;

  const handleDownloadAttendance = () => {
    const csvContent = [
      ['Student Name', 'Email', 'Attendance %'],
      ...(course.enrolledStudents?.map(student => [
        student.name,
        student.email,
        '85%' // Mock data
      ]) || [])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.code}_attendance.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
              <p className="text-sm text-gray-600">{course.code}</p>
            </div>
            <button
              onClick={handleDownloadAttendance}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Attendance</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setSelectedMethod('qr')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedMethod === 'qr'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <QrCode className="w-8 h-8 text-blue-600 mb-2" />
            <span className="font-medium text-gray-900">QR Code</span>
          </button>

          <button
            onClick={() => setSelectedMethod('bluetooth')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedMethod === 'bluetooth'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            <Bluetooth className="w-8 h-8 text-indigo-600 mb-2" />
            <span className="font-medium text-gray-900">Bluetooth</span>
          </button>

          <button
            onClick={() => setSelectedMethod('code')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedMethod === 'code'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
          >
            <Hash className="w-8 h-8 text-green-600 mb-2" />
            <span className="font-medium text-gray-900">Code</span>
          </button>

          <button
            onClick={() => setSelectedMethod('manual')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedMethod === 'manual'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-purple-300'
            }`}
          >
            <UserCheck className="w-8 h-8 text-purple-600 mb-2" />
            <span className="font-medium text-gray-900">Manual</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          {selectedMethod === 'qr' && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code for Attendance</h3>
              <div className="inline-block p-4 bg-white rounded-lg border-2 border-gray-200">
                <QRCodeSVG value={qrCode} size={200} />
              </div>
              <p className="text-sm text-gray-600 mt-4">Code refreshes every 20 seconds</p>
            </div>
          )}

          {selectedMethod === 'bluetooth' && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bluetooth Connection</h3>
              <div className="inline-block p-8 bg-indigo-50 rounded-lg">
                <Bluetooth className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-mono font-semibold text-indigo-900">{course.code}-BT</p>
              </div>
              <p className="text-sm text-gray-600 mt-4">Students can connect via Bluetooth</p>
            </div>
          )}

          {selectedMethod === 'code' && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Code</h3>
              <div className="inline-block p-8 bg-green-50 rounded-lg">
                <p className="text-4xl font-mono font-bold text-green-900">{attendanceCode}</p>
              </div>
              <p className="text-sm text-gray-600 mt-4">Code refreshes every 20 seconds</p>
            </div>
          )}

          {selectedMethod === 'manual' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Manual Attendance</h3>
              {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {course.enrolledStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setManualAttendance({ ...manualAttendance, [student.id]: true })
                          }
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            manualAttendance[student.id] === true
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() =>
                            setManualAttendance({ ...manualAttendance, [student.id]: false })
                          }
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            manualAttendance[student.id] === false
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No students enrolled yet</p>
              )}

              {course.enrolledStudents && course.enrolledStudents.length > 0 && (
                <button
                  onClick={handleManualAttendanceSubmit}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Manual Attendance</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Enrolled Students</h3>
            <button
              onClick={() => setShowEnrollLink(!showEnrollLink)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Generate Enroll Link</span>
            </button>
          </div>

          {showEnrollLink && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2 font-medium">Enrollment Link:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={enrollLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(enrollLink)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
              course.enrolledStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No students enrolled yet</p>
            )}
          </div>
        </div>

        {attendanceRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Attendance Requests ({attendanceRequests.length})
            </h3>

            <div className="space-y-3 mb-6">
              {attendanceRequests.map((request) => (
                <div key={request.studentId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{request.studentName}</p>
                    <p className="text-sm text-gray-600">Method: {request.method}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onToggleStudentPresence(request.studentId)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        request.present
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {request.present ? 'Present' : 'Absent'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onApproveAttendance}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Accept All ({attendanceRequests.length})</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
