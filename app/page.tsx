'use client';

import { useState, useEffect } from 'react';
import Modal from './components/Modal';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WelcomeSection from './components/WelcomeSection';
import LoadingSpinner from './components/LoadingSpinner';
import { authService, User } from './services/auth';

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const response = await authService.signIn({ email, password });

    if (response.ok) {
      setUser({email});
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
    }
  };

  const handleRegister = async (email: string, password: string, repeatPassword: string) => {
    await authService.signUp({ email, password });
    
    const userData = await authService.getCurrentUser();
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      setIsRegisterModalOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">
                Task Tracker
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  Hello, {user.email}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Tasks
            </h2>
            <p className="text-gray-600">
              Your task list will be here. Functionality will be added in future iterations.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <WelcomeSection
        onLoginClick={() => setIsLoginModalOpen(true)}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
      />

      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Login"
      >
        <LoginForm
          onSubmit={handleLogin}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </Modal>

      {/* Registration Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Registration"
      >
        <RegisterForm
          onSubmit={handleRegister}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      </Modal>
    </>
  );
}
