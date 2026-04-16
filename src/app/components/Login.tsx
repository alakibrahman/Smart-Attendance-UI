import { useState } from 'react';
import { LogIn, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'student' | 'teacher', email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && selectedRole) {
      onLogin(selectedRole, email);
    }
  };

  if (selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Attendance</h1>
            <p className="text-gray-600">Sign in with your Google account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                selectedRole === 'student'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <LogIn className="w-5 h-5" />
              <span>Login as {selectedRole === 'student' ? 'Student' : 'Teacher'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="w-full text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Back
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Mock login - No authentication required for demo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Attendance</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setSelectedRole('student')}
            className="w-full bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center justify-center space-x-3">
              <LogIn className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              <span className="font-medium text-gray-900">Login as Student</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Sign in with Google</p>
          </button>

          <button
            onClick={() => setSelectedRole('teacher')}
            className="w-full bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
          >
            <div className="flex items-center justify-center space-x-3">
              <LogIn className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
              <span className="font-medium text-gray-900">Login as Teacher</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Sign in with Google</p>
          </button>
        </div>
      </div>
    </div>
  );
}
