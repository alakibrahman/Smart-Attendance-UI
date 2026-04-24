import { useState } from 'react';
import { Login } from './components/Login';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentCourses } from './components/StudentCourses';
import { StudentCourseDetail } from './components/StudentCourseDetail';
import { TeacherCourses } from './components/TeacherCourses';
import { TeacherCourseDetail } from './components/TeacherCourseDetail';
import { AddCourseModal } from './components/AddCourseModal';
import { Course, AttendanceRequest, User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Data Structures and Algorithms',
      code: 'CS201',
      enrolledStudents: [
        { id: 's1', name: 'John Doe', email: 'john@example.com' },
        { id: 's2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
      attendanceRecords: [
        { date: '2026-04-01', present: true },
        { date: '2026-04-08', present: true },
        { date: '2026-04-14', present: false },
      ]
    },
    {
      id: '2',
      name: 'Database Management Systems',
      code: 'CS301',
      enrolledStudents: [
        { id: 's1', name: 'John Doe', email: 'john@example.com' },
      ],
      attendanceRecords: [
        { date: '2026-04-02', present: true },
        { date: '2026-04-09', present: true },
      ]
    },
    {
      id: '3',
      name: 'Operating Systems',
      code: 'CS202',
      enrolledStudents: [
        { id: 's1', name: 'John Doe', email: 'john@example.com' },
      ],
      attendanceRecords: [
        { date: '2026-04-03', present: false },
        { date: '2026-04-10', present: true },
      ]
    },
  ]);

  const [studentView, setStudentView] = useState<'courses' | 'dashboard'>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<'idle' | 'pending' | 'approved'>('idle');
  const [attendanceRequests, setAttendanceRequests] = useState<AttendanceRequest[]>([]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  const handleLogin = (role: 'student' | 'teacher', email: string) => {
    setUser({
      id: role === 'student' ? 's1' : 't1',
      name: email.split('@')[0],
      email,
      role,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCourseId(null);
    setAttendanceStatus('idle');
    setAttendanceRequests([]);
    setStudentView('courses');
  };

  const handleStudentSubmitAttendance = (courseId: string, method: string, value: string) => {
    setAttendanceStatus('approved');
    setAttendanceRequests([
      ...attendanceRequests,
      {
        studentId: user!.id,
        studentName: user!.name,
        courseId,
        method,
        present: true,
      },
    ]);
  };

  const handleTeacherApproveAttendance = () => {
    if (selectedCourseId) {
      const currentDate = new Date().toISOString().split('T')[0];
      setCourses(
        courses.map((course) =>
          course.id === selectedCourseId
            ? {
                ...course,
                attendanceRecords: [
                  ...(course.attendanceRecords || []),
                  { date: currentDate, present: true },
                ],
              }
            : course
        )
      );
    }

    setAttendanceRequests([]);

    setTimeout(() => {
      setAttendanceStatus('idle');
      setSelectedCourseId(null);
    }, 2000);
  };

  const handleManualAttendance = (selectedStudents: { studentId: string; present: boolean }[]) => {
    // Process manual attendance
    console.log('Manual attendance submitted:', selectedStudents);
    setSelectedCourseId(null);
  };

  const handleToggleStudentPresence = (studentId: string) => {
    setAttendanceRequests(
      attendanceRequests.map((req) =>
        req.studentId === studentId ? { ...req, present: !req.present } : req
      )
    );
  };

  const handleAddCourse = (name: string, code: string) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name,
      code,
      teacherId: user!.id,
      enrolledStudents: [],
      attendanceRecords: [],
    };
    setCourses([...courses, newCourse]);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter((c) => c.id !== courseId));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === 'student') {
    const selectedCourse = courses.find((c) => c.id === selectedCourseId);

    if (selectedCourse) {
      return (
        <StudentCourseDetail
          course={selectedCourse}
          onBack={() => {
            setSelectedCourseId(null);
            setAttendanceStatus('idle');
          }}
          onSubmitAttendance={handleStudentSubmitAttendance}
          attendanceStatus={attendanceStatus}
        />
      );
    }

    return (
      <StudentDashboard
        courses={courses}
        onNavigate={setStudentView}
        currentView={studentView}
        onLogout={handleLogout}
      >
        {studentView === 'courses' ? (
          <StudentCourses
            courses={courses}
            onSelectCourse={setSelectedCourseId}
          />
        ) : null}
      </StudentDashboard>
    );
  }

  if (user.role === 'teacher') {
    const selectedCourse = courses.find((c) => c.id === selectedCourseId);

    if (selectedCourse) {
      const courseRequests = attendanceRequests.filter(
        (req) => req.courseId === selectedCourse.id
      );

      return (
        <TeacherCourseDetail
          course={selectedCourse}
          onBack={() => setSelectedCourseId(null)}
          attendanceRequests={courseRequests}
          onApproveAttendance={handleTeacherApproveAttendance}
          onToggleStudentPresence={handleToggleStudentPresence}
          onManualAttendance={handleManualAttendance}
        />
      );
    }

    return (
      <>
        <TeacherCourses
          courses={courses}
          onSelectCourse={setSelectedCourseId}
          onAddCourse={() => setShowAddCourseModal(true)}
          onLogout={handleLogout}
        />
        {showAddCourseModal && (
          <AddCourseModal
            onClose={() => setShowAddCourseModal(false)}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            existingCourses={courses}
          />
        )}
      </>
    );
  }

  return null;
}
