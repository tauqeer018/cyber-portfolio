import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Save } from 'lucide-react';

export function ProfileManager() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', avatar_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data } = await supabase.from('profile').select('*').limit(1).single();
    if (data) {
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        avatar_url: data.avatar_url || ''
      });
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    if (profile) {
      await supabase.from('profile').update({
        name: formData.name,
        email: formData.email,
        avatar_url: formData.avatar_url
      }).eq('id', profile.id);
    } else {
      await supabase.from('profile').insert([{
        name: formData.name,
        email: formData.email,
        avatar_url: formData.avatar_url
      }]);
    }
    
    setSaving(false);
    alert('Profile updated');
    fetchProfile();
  }

  if (loading) return <div className="animate-pulse font-mono text-[#00FF66]">Loading data...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-[#1a2a1a] pb-4">
        <h2 className="text-xl font-mono text-white uppercase tracking-widest">
          <span className="text-[#00FF66] mr-3">_</span> Identity Profile
        </h2>
      </div>

      <form onSubmit={handleSave} className="bg-[#020602] border border-[#1a2a1a] rounded-xl p-6 space-y-4 font-mono text-[12px] max-w-2xl">
        <label className="block">
          <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Display Name</span>
          <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-white outline-none focus:border-[#00FF66]" />
        </label>
        <label className="block">
          <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Contact Email</span>
          <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-white outline-none focus:border-[#00FF66]" />
        </label>
        <label className="block">
          <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Avatar URL (Optional)</span>
          <input value={formData.avatar_url} onChange={e=>setFormData({...formData, avatar_url: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-[#00FF66] outline-none focus:border-[#00FF66]" placeholder="https://..." />
        </label>
        
        <div className="pt-4 border-t border-[#1a2a1a]">
          <button disabled={saving} type="submit" className="flex items-center gap-2 text-black bg-[#00FF66] px-4 py-2 rounded-md font-mono text-[12px] uppercase tracking-widest hover:bg-[#00cc55] cursor-pointer disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
