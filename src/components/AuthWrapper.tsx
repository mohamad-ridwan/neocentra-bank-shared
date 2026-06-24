import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../store';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        const mockPayload = {
          user: {
            username: 'admin',
            role: 'Super Administrator',
            email: 'admin@neocentra.com',
          },
          token: 'mock-jwt-token-neocentra-12345',
        };
        localStorage.setItem('neocentra_token', mockPayload.token);
        dispatch(loginSuccess(mockPayload));
      } else {
        setError('Invalid username or password (use admin / admin123)');
      }
      setLoading(false);
    }, 800);
  };

  if (auth?.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4 font-sans relative overflow-hidden">
      {/* Background gradients for premium glassmorphic effect */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative z-10 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-4">
            <span className="text-white font-black text-xl tracking-tighter">N</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">NeoCentra Bank</h2>
          <p className="text-xs text-slate-400 mt-1">Backoffice Shell Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-xs text-slate-500">
            Authorized Personnel Only • Access Logged
          </span>
        </div>
      </div>
    </div>
  );
}
export default AuthWrapper;
