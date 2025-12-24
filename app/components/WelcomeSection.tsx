'use client';

interface WelcomeSectionProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function WelcomeSection({ onLoginClick, onRegisterClick }: WelcomeSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Task Tracker
          </h1>
          <p className="text-gray-600 mb-8">
            Manage your tasks efficiently
          </p>
          
          <div className="space-y-4">
            <button
              onClick={onLoginClick}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
            >
              Login
            </button>
            
            <button
              onClick={onRegisterClick}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium"
            >
              Register
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Create an account or login to start managing your tasks
          </p>
        </div>
      </div>
    </div>
  );
}
