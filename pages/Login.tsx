import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/mockDatabase';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToLanding: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToLanding }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isLogin) {
      const user = db.authenticate(email);
      
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials. Try: sarah@example.com / mike@lovableswim.com / admin@lovableswim.com');
      }
    } else {
      try {
        const newUser: User = {
          id: `u${Date.now()}`,
          name: email.split('@')[0], 
          email: email,
          role: UserRole.CLIENT,
          packageCredits: 0,
          avatarUrl: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
        };
        const createdUser = db.createUser(newUser);
        onLogin(createdUser);
      } catch (err: any) {
        setError(err.message || 'Failed to create account');
      }
    }
  };

  const fillDemoCreds = (emailToFill: string) => {
      setEmail(emailToFill);
      setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center justify-center cursor-pointer mb-8" onClick={onNavigateToLanding}>
          <div className="text-zinc-900 font-extrabold text-4xl leading-none tracking-tight uppercase">
            LIFE TIME
          </div>
          <div className="text-zinc-900 font-serif italic text-3xl leading-none -mt-1 ml-0.5">
            Swim
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 uppercase">
          {isLogin ? 'Member Sign In' : 'Create Account'}
        </h2>
        <p className="mt-4 text-center text-sm text-zinc-600">
          Or{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-zinc-900 hover:text-black underline">
            {isLogin ? 'join the club today' : 'sign in to existing account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-10 px-6 shadow-xl sm:rounded-lg sm:px-10 border-t-4 border-t-zinc-900">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 uppercase tracking-wide">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-zinc-300 px-3 py-2 placeholder-zinc-400 text-zinc-900 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 uppercase tracking-wide">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-zinc-300 px-3 py-2 placeholder-zinc-400 text-zinc-900 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full flex justify-center py-3">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </div>
          </form>

          {isLogin && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-zinc-400 uppercase tracking-wider text-xs">Demo Access</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Button variant="outline" size="sm" onClick={() => fillDemoCreds('sarah@example.com')} className="text-xs">
                  Client
                </Button>
                <Button variant="outline" size="sm" onClick={() => fillDemoCreds('mike@lovableswim.com')} className="text-xs">
                  Instructor
                </Button>
                <Button variant="outline" size="sm" onClick={() => fillDemoCreds('admin@lovableswim.com')} className="text-xs">
                  Admin
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};