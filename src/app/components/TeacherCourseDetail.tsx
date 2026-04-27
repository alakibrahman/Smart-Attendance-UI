import { useState, useEffect } from 'react';
import { ArrowLeft, Bluetooth, Hash, UserPlus, Download, Users, CheckCircle, UserCheck, Trash2 } from 'lucide-react';
import { Course, AttendanceRequest, Student } from '../types';

interface TeacherCourseDetailProps {
  course: Course;
  onBack: () => void;
  attendanceRequests: AttendanceRequest[];
  onApproveAttendance: () => void;
  onToggleStudentPresence: (studentId: string) => void;
  onManualAttendance: (selectedStudents: { studentId: string; present: boolean }[]) => void;
  onDeleteStudent: (courseId: string, studentId: string) => void;
}

export function TeacherCourseDetail({
  course,
  onBack,
  attendanceRequests,
  onApproveAttendance,
  onToggleStudentPresence,
  onManualAttendance,
  onDeleteStudent
}: TeacherCourseDetailProps) {
  const [selectedMethod, setSelectedMethod] = useState<'bluetooth' | 'code' | 'manual'>('bluetooth');
  const [studentAttendance, setStudentAttendance] = useState<{ [studentId: string]: boolean }>({});
  const [attendanceCode, setAttendanceCode] = useState('');
  const [showEnrollLink, setShowEnrollLink] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [scanMessage, setScanMessage] = useState('Bluetooth scan results are shown below.');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'present' | 'absent'>('all');

  useEffect(() => {
    setAttendanceCode(Math.random().toString(36).substring(2, 8).toUpperCase());

    const interval = setInterval(() => {
      setAttendanceCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ((selectedMethod === 'manual' || selectedMethod === 'bluetooth') && course.enrolledStudents) {
      const initialAttendance: { [studentId: string]: boolean } = {};
      course.enrolledStudents.forEach((student) => {
        initialAttendance[student.id] =
          studentAttendance[student.id] !== undefined ? studentAttendance[student.id] : false;
      });
      setStudentAttendance(initialAttendance);
    }
  }, [selectedMethod, course.enrolledStudents]);

  const simulateBluetoothScan = () => {
    if (!course.enrolledStudents) return;

    const detectedAttendance = course.enrolledStudents.reduce<{ [studentId: string]: boolean }>(
      (acc, student) => {
        acc[student.id] = student.id.endsWith('1') || student.id.endsWith('3') || student.id.endsWith('5');
        return acc;
      },
      {}
    );

    setStudentAttendance((prev) => ({
      ...prev,
      ...detectedAttendance,
    }));
    setScanMessage('Bluetooth scan updated. Students with Bluetooth turned on are marked present automatically.');
  };

  const handleAttendanceSubmit = () => {
    const selectedStudents = Object.entries(studentAttendance).map(([studentId, present]) => ({
      studentId,
      present,
    }));
    onManualAttendance(selectedStudents);
    setStudentAttendance({});
  };

  const getFilteredStudents = () => {
    if (!course.enrolledStudents) return [];

    if (attendanceFilter === 'all') return course.enrolledStudents;
    if (attendanceFilter === 'present') {
      return course.enrolledStudents.filter(student => studentAttendance[student.id] === true);
    }
    if (attendanceFilter === 'absent') {
      return course.enrolledStudents.filter(student => studentAttendance[student.id] === false);
    }
    return course.enrolledStudents;
  };

  const handleDeleteStudent = (student: Student) => {
    if (window.confirm(`Are you sure you want to remove ${student.name} from this course?`)) {
      onDeleteStudent(course.id, student.id);
    }
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => {
              setSelectedMethod('bluetooth');
              setAttendanceFilter('all');
            }}
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
            onClick={() => {
              setSelectedMethod('code');
              setAttendanceFilter('all');
            }}
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
            onClick={() => {
              setSelectedMethod('manual');
              setAttendanceFilter('all');
            }}
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
          {selectedMethod === 'bluetooth' && (
            <div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bluetooth Attendance</h3>
                  <p className="text-sm text-gray-600">
                    Students with Bluetooth turned on are marked present automatically. You can override any student's status manually.
                  </p>
                </div>
                <button
                  onClick={simulateBluetoothScan}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Refresh Scan
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-6">{scanMessage}</p>

              {/* Attendance Filter Buttons */}
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <button
                  onClick={() => setAttendanceFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    attendanceFilter === 'all'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All ({course.enrolledStudents?.length || 0})
                </button>
                <button
                  onClick={() => setAttendanceFilter('present')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    attendanceFilter === 'present'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Present ({course.enrolledStudents?.filter(s => studentAttendance[s.id] === true).length || 0})
                </button>
                <button
                  onClick={() => setAttendanceFilter('absent')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    attendanceFilter === 'absent'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Absent ({course.enrolledStudents?.filter(s => studentAttendance[s.id] === false).length || 0})
                </button>
              </div>

              {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {getFilteredStudents().map((student) => (
                    <div key={student.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          studentAttendance[student.id]
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {studentAttendance[student.id] ? 'Present' : 'Absent'}
                        </span>
                        <button
                          onClick={() =>
                            setStudentAttendance({ ...studentAttendance, [student.id]: true })
                          }
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            studentAttendance[student.id]
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() =>
                            setStudentAttendance({ ...studentAttendance, [student.id]: false })
                          }
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            studentAttendance[student.id] === false
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
                  onClick={handleAttendanceSubmit}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Bluetooth Attendance</span>
                </button>
              )}
            </div>
          )}

          {selectedMethod === 'code' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Code</h3>
              <div className="text-center mb-6">
                <div className="inline-block p-8 bg-green-50 rounded-lg">
                  <p className="text-4xl font-mono font-bold text-green-900">{attendanceCode}</p>
                </div>
                <p className="text-sm text-gray-600 mt-4">Code refreshes every 20 seconds</p>
              </div>

              {/* Attendance Filter Buttons for Code Method */}
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-sm font-medium text-gray-700">Filter Requests:</span>
                <button
                  onClick={() => setAttendanceFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    attendanceFilter === 'all'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All ({attendanceRequests.length})
                </button>
                <button
                  onClick={() => setAttendanceFilter('present')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    attendanceFilter === 'present'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Present ({attendanceRequests.filter(r => r.present).length})
                </button>
                <button
                  onClick={() => setAttendanceFilter('absent')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    attendanceFilter === 'absent'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Absent ({attendanceRequests.filter(r => !r.present).length})
                </button>
              </div>
            </div>
          )}

          {selectedMethod === 'manual' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Manual Attendance</h3>

              {/* Attendance Filter Buttons */}
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <button
                  onClick={() => setAttendanceFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    attendanceFilter === 'all'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All ({course.enrolledStudents?.length || 0})
                </button>
                <button
                  onClick={() => setAttendanceFilter('present')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    attendanceFilter === 'present'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Present ({course.enrolledStudents?.filter(s => studentAttendance[s.id] === true).length || 0})
                </button>
                <button
                  onClick={() => setAttendanceFilter('absent')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    attendanceFilter === 'absent'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Absent ({course.enrolledStudents?.filter(s => studentAttendance[s.id] === false).length || 0})
                </button>
              </div>

              {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {getFilteredStudents().map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setStudentAttendance({ ...studentAttendance, [student.id]: true })
                          }
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            studentAttendance[student.id] === true
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() =>
                            setStudentAttendance({ ...studentAttendance, [student.id]: false })
                          }
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            studentAttendance[student.id] === false
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
                  onClick={handleAttendanceSubmit}
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
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">Enrolled Students</h3>
              <button
                onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  showDeleteMenu ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
            <button
              onClick={() => setShowEnrollLink(!showEnrollLink)}
              aria-label="Generate Enroll Link"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
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

          {showDeleteMenu && course.enrolledStudents && course.enrolledStudents.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-700 mb-3">Select a student to delete:</p>
              <div className="space-y-2">
                {course.enrolledStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleDeleteStudent(student)}
                    className="w-full text-left bg-white px-4 py-3 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </div>
                  </button>
                ))}
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
