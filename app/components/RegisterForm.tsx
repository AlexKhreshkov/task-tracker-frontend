'use client';

import { useState, useEffect } from 'react';

interface RegisterFormProps {
  onSubmit: (email: string, password: string, repeatPassword: string) => Promise<void>;
  onClose: () => void;
}

export default function RegisterForm({ onSubmit, onClose }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    repeatPassword?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [repeatPasswordTouched, setRepeatPasswordTouched] = useState(false);

  useEffect(() => {
    if (password && repeatPassword) {
      const match = password === repeatPassword;
      setPasswordsMatch(match);
      // Only show mismatch if both fields have been touched
      setShowPasswordMismatch(!match && passwordTouched && repeatPasswordTouched);
    } else {
      setPasswordsMatch(true);
      setShowPasswordMismatch(false);
    }
  }, [password, repeatPassword, passwordTouched, repeatPasswordTouched]);

  const validateForm = () => {
    const newErrors: { 
      email?: string; 
      password?: string; 
      repeatPassword?: string 
    } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 3) {
      newErrors.password = 'Password must contain at least 3 characters';
    }

    if (!repeatPassword) {
      newErrors.repeatPassword = 'Password confirmation is required';
    } else if (password !== repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    return email && 
           password && 
           repeatPassword && 
           passwordsMatch && 
           email.includes('@') && 
           password.length >= 3;
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  const handleRepeatPasswordBlur = () => {
    setRepeatPasswordTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({});
      try {
        await onSubmit(email, password, repeatPassword);
      } catch (error) {
        setErrors({ general: error instanceof Error ? error.message : 'Registration failed' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="register-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={handlePasswordBlur}
          className={`w-full px-4 py-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
            showPasswordMismatch && password
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
          placeholder="Enter password (minimum 3 characters)"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="repeat-password" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          id="repeat-password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          onBlur={handleRepeatPasswordBlur}
          className={`w-full px-4 py-3 text-base border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
            showPasswordMismatch && repeatPassword
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
          placeholder="Repeat password"
        />
        <div className="min-h-[20px]">
          {errors.repeatPassword && <p className="text-red-500 text-sm mt-1">{errors.repeatPassword}</p>}
          {showPasswordMismatch && password && repeatPassword && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isSubmitting || (passwordTouched && repeatPasswordTouched && !passwordsMatch)}
          className="flex-1 bg-green-600 text-white py-3 px-6 text-base font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Registering...
            </div>
          ) : (
            'Register'
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
