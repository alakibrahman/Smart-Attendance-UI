export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface AttendanceRecord {
  date: string;
  present: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  teacherId?: string;
  enrolledStudents?: Student[];
  attendanceRecords?: AttendanceRecord[];
}

export interface AttendanceRequest {
  studentId: string;
  studentName: string;
  courseId: string;
  method: string;
  present: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}
