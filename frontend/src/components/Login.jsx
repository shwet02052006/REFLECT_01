import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    await login(username);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 bg-surface">
      <div className="w-full max-w-sm">
        <h1 className="text-[3.5rem] font-light tracking-[-0.04em] text-on-surface leading-tight mb-2 text-center">Chronos</h1>
        <p className="text-on-surface-variant text-center mb-10 tracking-[0.02em]">Welcome back. Please enter your username to continue your reflection.</p>
        
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full bg-surface-container-low rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-outline-variant text-[1rem] text-on-surface border border-outline-variant/10 focus:border-primary/50 transition-colors duration-0"
            required
          />
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-primary text-on-primary rounded-xl px-5 py-4 text-[0.875rem] font-bold uppercase tracking-[0.08em] hover:bg-primary-dim transition-colors duration-0 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
