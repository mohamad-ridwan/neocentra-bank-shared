import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { loginSuccess } from '../store';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: any) => state.auth);
  const [initializing, setInitializing] = useState(true);

  // 1. Auto-login dari localStorage token pada saat inisialisasi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('neocentra_token');
      if (token && !auth?.isAuthenticated) {
        const mockPayload = {
          user: {
            username: 'admin',
            role: 'Super Administrator',
            email: 'admin@neocentra.com',
          },
          token,
        };
        dispatch(loginSuccess(mockPayload));
      }
      setInitializing(false);
    }
  }, [auth?.isAuthenticated, dispatch]);

  const publicPaths = ['/login', '/otp', '/logout'];
  const isPublicPath = publicPaths.includes(router.pathname);

  // 2. Logika redirect berdasarkan status autentikasi dan path saat ini
  useEffect(() => {
    if (!initializing) {
      if (!auth?.isAuthenticated && !isPublicPath) {
        router.push('/login');
      } else if (auth?.isAuthenticated && isPublicPath && router.pathname !== '/logout') {
        router.push('/');
      }
    }
  }, [auth?.isAuthenticated, isPublicPath, router, initializing]);

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium tracking-wide">Mengecek sesi...</span>
        </div>
      </div>
    );
  }

  // Izinkan render jika:
  // - Pengguna terautentikasi
  // - Atau pengguna tidak terautentikasi tetapi berada di path publik
  if (auth?.isAuthenticated || isPublicPath) {
    return <>{children}</>;
  }

  // Tampilkan loading saat proses redirect
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        <span className="text-sm font-medium tracking-wide">Mengarahkan...</span>
      </div>
    </div>
  );
}

export default AuthWrapper;
