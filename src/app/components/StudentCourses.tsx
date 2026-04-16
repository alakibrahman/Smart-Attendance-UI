import { BookOpen, ChevronRight } from 'lucide-react';
import { Course } from '../types';

interface StudentCoursesProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export function StudentCourses({ courses, onSelectCourse }: StudentCoursesProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Courses</h2>
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
