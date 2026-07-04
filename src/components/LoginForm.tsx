import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Zod schema for validation
const loginSchema = z.object({
  username: z.string().min(3, "Username must have at least 3 characters"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

type LoginFormDate = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormDate) => Promise<void>;
  errorMessage?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, errorMessage }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormDate>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmitHandler = async (data: LoginFormDate) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Login form error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {errorMessage && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
          <p className="font-medium">Error</p>
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-semibold text-gray-800">
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          {...register("username")}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
            errors.username 
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/50' 
              : 'border-gray-300 focus:border-rotary-blue focus:ring-2 focus:ring-rotary-blue/30'
          }`}
          placeholder="admin"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600 font-medium">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
            errors.password
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
              : 'border-gray-300 focus:border-rotary-blue focus:ring-2 focus:ring-rotary-blue/30'
          }`}
          placeholder="Your password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 font-medium">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-5 w-5 text-rotary-blue focus:ring-2 focus:ring-rotary-blue border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-3 text-sm text-gray-700 cursor-pointer">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-semibold text-rotary-blue hover:text-blue-800 transition-colors">
            Forgot password?
          </a>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full btn-primary py-3 text-base font-bold rounded-lg transition-all duration-300 ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
        }`}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="pt-4 text-center border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Need portal access?{' '}
          <Link href="/pre-access" className="font-medium text-rotary-blue hover:text-rotary-gold">
            Request pre-access
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
