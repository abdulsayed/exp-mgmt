import React, { useState } from 'react';
import { Database, Lock, User, AlertCircle, ArrowRight, Info } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Invalid credentials. Please use admin / admin.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
            <Database className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Expense Schema Explorer</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to access the database documentation</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl leading-5 bg-gray-950 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl leading-5 bg-gray-950 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Hint Footer */}
          <div className="bg-gray-850 px-8 py-4 border-t border-gray-800 flex justify-center">
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Dummy Admin: <span className="font-mono text-gray-400 bg-gray-950 px-1.5 py-0.5 rounded">admin</span> / <span className="font-mono text-gray-400 bg-gray-950 px-1.5 py-0.5 rounded">admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
