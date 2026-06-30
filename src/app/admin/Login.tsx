import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router';
import { TerminalInput } from '../components/cyber-bits';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email !== 'tauqeerulhassan015@gmail.com') {
      setError('ACCESS DENIED: Unauthorized Identity.');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(`ACCESS DENIED: ${authError.message}`);
    } else {
      navigate('/my-admin-dashboard-241100');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0F0A] flex flex-col items-center justify-center p-6 selection:bg-[#00FF66] selection:text-black">
      <div className="w-full max-w-md bg-[#020602] border border-[#1a2a1a] rounded-2xl overflow-hidden p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-3 h-3 rounded-full bg-[#00FF66]" style={{ boxShadow: '0 0 10px #00FF66' }} />
          <h1 className="font-mono text-[14px] text-white tracking-[0.2em] uppercase">Auth Required</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <label className="block">
            <span className="font-mono text-[11px] tracking-[0.18em] text-[#4A4D53] uppercase">
              <span className="text-[#00FF66]">$</span> IDENTITY
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-transparent border border-[#224422] focus:border-[#00FF66] rounded-md px-4 py-3 font-mono text-[14px] text-[#d5f5d5] outline-none placeholder:text-[#2f4a2f]"
              placeholder="operator@blackbox.sec"
              required
            />
          </label>
          <label className="block">
            <span className="font-mono text-[11px] tracking-[0.18em] text-[#4A4D53] uppercase">
              <span className="text-[#00FF66]">$</span> KEY
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-transparent border border-[#224422] focus:border-[#00FF66] rounded-md px-4 py-3 font-mono text-[14px] text-[#d5f5d5] outline-none placeholder:text-[#2f4a2f]"
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <div className="text-[#ff5577] font-mono text-[11px] tracking-widest uppercase">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00FF66]/10 hover:bg-[#00FF66]/20 border border-[#00FF66]/30 text-[#00FF66] font-mono text-[12px] tracking-[0.3em] uppercase py-3 rounded-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Decrypting...' : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
}
