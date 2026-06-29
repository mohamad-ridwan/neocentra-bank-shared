import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { loginSuccess, logout } from "../store";
import { apiFetch } from "../utils/apiHelper";
import { Clock } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: any) => state.auth);
  const [initializing, setInitializing] = useState(true);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const lastActivityRef = useRef<number>(Date.now());
  const warningOpenRef = useRef<boolean>(false);

  // Helper functions for logout actions
  const handleForceLogout = async () => {
    setIsWarningOpen(false);
    warningOpenRef.current = false;
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    try {
      dispatch(logout());
    } catch (err) {
      console.error("Redux logout failed:", err);
    }
    router.push("/login?timeout=true");
  };

  const handleLogoutAction = async () => {
    setIsWarningOpen(false);
    warningOpenRef.current = false;
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    try {
      dispatch(logout());
    } catch (err) {
      console.error("Redux logout failed:", err);
    }
    router.push("/login");
  };

  const handleRefreshSession = async () => {
    try {
      await apiFetch("/api/auth/session?refresh=true");
      lastActivityRef.current = Date.now();
      setIsWarningOpen(false);
      warningOpenRef.current = false;
    } catch (err) {
      console.error("Failed to refresh session:", err);
      handleForceLogout();
    }
  };

  // 1. Auto-login dari BFF session cookie pada saat inisialisasi
  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await apiFetch<{ user: any }>("/api/auth/session");
        if (data && data.user) {
          dispatch(loginSuccess({ user: data.user, token: null }));
        }
      } catch (err) {
        console.warn("No active session:", err);
      } finally {
        setInitializing(false);
      }
    };

    if (typeof window !== "undefined") {
      if (!auth?.isAuthenticated) {
        checkSession();
      } else {
        setInitializing(false);
      }
    }
  }, [auth?.isAuthenticated, dispatch]);

  // 2. Inactivity timer logic
  useEffect(() => {
    if (!auth?.isAuthenticated || initializing) return;

    const resetActivity = () => {
      // If warning modal is open, ignore events to prevent closing modal by moving mouse
      if (warningOpenRef.current) return;
      lastActivityRef.current = Date.now();
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetActivity);
    });

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivityRef.current) / 1000);

      // Warning starts at 270s (4.5 minutes), total timeout is 300s (5 minutes)
      if (elapsed >= 270) {
        const remaining = 300 - elapsed;
        if (remaining <= 0) {
          clearInterval(interval);
          handleForceLogout();
        } else {
          if (!warningOpenRef.current) {
            setIsWarningOpen(true);
            warningOpenRef.current = true;
          }
          setCountdown(remaining);
        }
      } else {
        if (warningOpenRef.current) {
          setIsWarningOpen(false);
          warningOpenRef.current = false;
        }
      }
    }, 1000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetActivity);
      });
      clearInterval(interval);
    };
  }, [auth?.isAuthenticated, initializing]);

  const publicPaths = ["/login", "/otp", "/logout"];
  const isPublicPath = publicPaths.includes(router.pathname);

  // 3. Logika redirect berdasarkan status autentikasi dan path saat ini
  useEffect(() => {
    if (!initializing) {
      if (!auth?.isAuthenticated && !isPublicPath) {
        router.push("/login");
      } else if (
        auth?.isAuthenticated &&
        isPublicPath &&
        router.pathname !== "/logout"
      ) {
        router.push("/");
      }
    }
  }, [auth?.isAuthenticated, isPublicPath, router, initializing]);

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium tracking-wide">
            Mengecek sesi...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {(auth?.isAuthenticated || isPublicPath) ? children : (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
            <span className="text-sm font-medium tracking-wide">
              Mengarahkan...
            </span>
          </div>
        </div>
      )}

      {isWarningOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 relative overflow-hidden transition-all duration-300">
            {/* Ambient gradients */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-500/10 animate-pulse">
                <Clock className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Pemberitahuan Sesi Berakhir
              </h3>
              
              <p className="text-sm text-slate-300 mb-6 leading-relaxed px-2">
                Sesi Anda akan segera berakhir dalam <span className="font-extrabold text-teal-400 text-lg mx-1">{countdown}</span> detik karena inaktivitas. Apakah Anda ingin melanjutkan sesi?
              </p>
              
              <div className="flex w-full gap-3">
                <button
                  onClick={handleLogoutAction}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-colors duration-200"
                >
                  Keluar
                </button>
                <button
                  onClick={handleRefreshSession}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-white hover:from-teal-600 hover:to-indigo-600 shadow-md shadow-indigo-500/20 active:scale-98 transition-all duration-200"
                >
                  Lanjutkan Sesi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthWrapper;
