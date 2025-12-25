'use client';

import { useState, useEffect } from 'react';
import Modal from './components/Modal';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WelcomeSection from './components/WelcomeSection';
import LoadingSpinner from './components/LoadingSpinner';
import TaskManager from './components/TaskManager';
import Header from './components/Header';
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
        <Header user={user} onLogout={handleLogout} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TaskManager />
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
