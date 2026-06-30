import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { FolderGit2, User, Code2, Bell, LogOut, Terminal } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Login } from './Login';
import type { Session } from '@supabase/supabase-js';

export function AdminLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0A0F0A] min-h-screen text-[#00FF66] font-mono flex items-center justify-center">
        ESTABLISHING SECURE CONNECTION...
      </div>
    );
  }

  if (!session || session.user.email !== 'tauqeerulhassan015@gmail.com') {
    return <Login />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const menu = [
    { name: 'Projects', path: '/my-admin-dashboard-241100', icon: FolderGit2 },
    { name: 'Skills', path: '/my-admin-dashboard-241100/skills', icon: Code2 },
    { name: 'Profile', path: '/my-admin-dashboard-241100/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#0A0F0A] text-[#9bb09b] font-mono selection:bg-[#00FF66] selection:text-black">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#1a2a1a] bg-[#020602] flex flex-col">
        <div className="p-6 border-b border-[#1a2a1a] flex items-center gap-3">
          <Terminal className="w-5 h-5 text-[#00FF66]" />
          <span className="text-white tracking-[0.2em] font-bold uppercase text-[13px]">SYS_ADMIN</span>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20' 
                    : 'hover:bg-[#1a2a1a] hover:text-white border border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-[12px] tracking-widest uppercase">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#1a2a1a]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[#ff5577]/10 hover:text-[#ff5577] transition-colors text-[12px] tracking-widest uppercase"
          >
            <LogOut className="w-4 h-4" />
            Terminate
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-[#1a2a1a] flex items-center justify-between px-8 bg-[#020602]">
          <span className="text-[12px] tracking-[0.3em] uppercase opacity-50">
            Node: islamabad/pk · Status: Online
          </span>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-[#1a2a1a] rounded-full transition-colors text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff5577] rounded-full shadow-[0_0_8px_#ff5577]"></span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
