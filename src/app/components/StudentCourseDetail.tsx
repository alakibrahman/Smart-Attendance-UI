import { useState } from 'react';
import { ArrowLeft, QrCode, Bluetooth, Hash, Camera, CheckCircle, Clock } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { Course } from '../types';

interface StudentCourseDetailProps {
  course: Course;
  onBack: () => void;
  onSubmitAttendance: (courseId: string, method: string, value: string) => void;
  attendanceStatus: 'idle' | 'pending' | 'approved';
}

export function StudentCourseDetail({ course, onBack, onSubmitAttendance, attendanceStatus }: StudentCourseDetailProps) {
  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'bluetooth' | 'code' | null>(null);
  const [code, setCode] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleQRScan = async () => {
    setSelectedMethod('qr');
    setScanning(true);

    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          html5QrCode.stop();
          setScanning(false);
          onSubmitAttendance(course.id, 'qr', decodedText);
        },
        (errorMessage) => {
          // Handle scan failure
        }
      );
    } catch (err) {
      setScanning(false);
      // Simulate QR scan for demo
      onSubmitAttendance(course.id, 'qr', 'mock-qr-code');
    }
  };

  const handleBluetoothConnect = () => {
    setSelectedMethod('bluetooth');
    // Simulate Bluetooth connection for demo
    onSubmitAttendance(course.id, 'bluetooth', 'mock-bluetooth-connection');
  };

  const handleCodeSubmit = () => {
    if (code.trim()) {
      setSelectedMethod('code');
      onSubmitAttendance(course.id, 'code', code);
      setCode('');
    }
  };

  if (attendanceStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pending Approval</h2>
          <p className="text-gray-600 mb-6">
            Your attendance is pending teacher approval. Please wait...
          </p>
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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

        {scanning ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div id="qr-reader" className="w-full mb-4"></div>
            <button
              onClick={() => {
                setScanning(false);
                setSelectedMethod(null);
              }}
              className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel Scan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={handleQRScan}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <QrCode className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">QR Code Scan</h3>
              <p className="text-sm text-gray-600">Scan teacher's QR code</p>
            </button>

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
        )}
      </main>
    </div>
  );
}
