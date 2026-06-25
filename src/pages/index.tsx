import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-slate-100 font-sans">
      <div className="text-center space-y-4 max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center mx-auto text-white font-black text-xl">
          S
        </div>
        <h1 className="text-2xl font-bold tracking-tight">NeoCentra Shared Remote</h1>
        <p className="text-sm text-slate-400">
          This is the remote MFE running on port <code className="text-teal-400 font-mono">3342</code>. It exposes UI components, API clients, and the Redux store.
        </p>
      </div>
    </div>
  );
}
