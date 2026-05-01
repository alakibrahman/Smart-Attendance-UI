import { useState } from 'react';
import { LogIn } from 'lucide-react';

import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../../firebase";

interface LoginProps {
  onLogin: (role: 'student' | 'teacher', email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  // 🔐 Google Login Function
  const handleGoogleLogin = async () => {
    if (!selectedRole) return;

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 🔥 Save user to Firestore (first time only)
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: selectedRole,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }

      // ✅ Send data to parent
      onLogin(selectedRole, user.email!);

    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // 🔁 If role selected → show login button
  if (selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Attendance</h1>
            <p className="text-gray-600">Sign in with your Google account</p>
          </div>

          <div className="space-y-6">
            
            {/* 🔥 Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`w-full text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                selectedRole === 'student'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <LogIn className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button>

            {/* 🔙 Back Button */}
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="w-full text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Back
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 🔘 Role selection UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Attendance</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        <div className="space-y-4">
          
          {/* Student */}
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

          {/* Teacher */}
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
