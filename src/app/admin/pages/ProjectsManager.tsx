import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '', type: '', description: '', year: '', tech: '', dossier: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
    if (data) setProjects(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if(!confirm('Are you sure?')) return;
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const techArray = formData.tech.split(',').map(t => t.trim());
    let parsedDossier = [];
    try {
      parsedDossier = JSON.parse(formData.dossier);
    } catch {
      alert("Dossier must be valid JSON array. e.g. [\"text 1\", \"text 2\"]");
      return;
    }

    const payload = {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      year: formData.year,
      tech: techArray,
      dossier: parsedDossier
    };

    if (editingId === 'new') {
      await supabase.from('projects').insert([payload]);
    } else {
      await supabase.from('projects').update(payload).eq('id', editingId);
    }
    setEditingId(null);
    fetchProjects();
  }

  function startEdit(p: any) {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      type: p.type,
      description: p.description,
      year: p.year,
      tech: p.tech.join(', '),
      dossier: JSON.stringify(p.dossier, null, 2)
    });
  }

  function startNew() {
    setEditingId('new');
    setFormData({
      title: '', type: '', description: '', year: new Date().getFullYear().toString(), tech: '', dossier: '[]'
    });
  }

  if (loading) return <div className="animate-pulse font-mono text-[#00FF66]">Loading data...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-[#1a2a1a] pb-4">
        <h2 className="text-xl font-mono text-white uppercase tracking-widest">
          <span className="text-[#00FF66] mr-3">_</span> Projects Repository
        </h2>
        {!editingId && (
          <button onClick={startNew} className="flex items-center gap-2 text-[#00FF66] hover:text-white bg-[#00FF66]/10 px-3 py-1.5 rounded-md font-mono text-[12px] uppercase tracking-widest transition-colors cursor-pointer border border-[#00FF66]/30">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        )}
      </div>

      {editingId ? (
        <form onSubmit={handleSave} className="bg-[#020602] border border-[#1a2a1a] rounded-xl p-6 space-y-4 font-mono text-[12px]">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Title</span>
              <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-white outline-none focus:border-[#00FF66]" />
            </label>
            <label className="block">
              <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Type</span>
              <input required value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-white outline-none focus:border-[#00FF66]" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Year</span>
              <input required value={formData.year} onChange={e=>setFormData({...formData, year: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-white outline-none focus:border-[#00FF66]" />
            </label>
            <label className="block">
              <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Tech (comma separated)</span>
              <input required value={formData.tech} onChange={e=>setFormData({...formData, tech: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-white outline-none focus:border-[#00FF66]" />
            </label>
          </div>
          <label className="block">
            <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Description</span>
            <textarea required rows={3} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-white outline-none focus:border-[#00FF66] resize-none" />
          </label>
          <label className="block">
            <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Dossier (JSON Array of strings)</span>
            <textarea required rows={4} value={formData.dossier} onChange={e=>setFormData({...formData, dossier: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-[#00FF66] outline-none focus:border-[#00FF66] font-mono text-[11px] resize-none" />
          </label>
          
          <div className="flex gap-4 pt-4 border-t border-[#1a2a1a]">
            <button type="submit" className="flex items-center gap-2 text-black bg-[#00FF66] px-4 py-2 rounded-md font-mono text-[12px] uppercase tracking-widest hover:bg-[#00cc55] cursor-pointer">
              <Save className="w-4 h-4" /> Save
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="flex items-center gap-2 text-white bg-[#1a2a1a] px-4 py-2 rounded-md font-mono text-[12px] uppercase tracking-widest hover:bg-[#2a3a2a] cursor-pointer">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {projects.length === 0 && <p className="opacity-50 font-mono text-[12px]">No projects found. Add one above.</p>}
          {projects.map(p => (
            <div key={p.id} className="bg-[#020602] border border-[#1a2a1a] rounded-xl p-6 flex justify-between items-center group hover:border-[#00FF66]/30 transition-colors">
              <div>
                <h3 className="text-white font-mono uppercase tracking-widest text-[14px]">{p.title}</h3>
                <p className="text-[#4A4D53] font-mono text-[12px] mt-1">{p.type} · {p.year}</p>
              </div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(p)} className="p-2 text-[#9bb09b] hover:text-[#00FF66] bg-[#1a2a1a] hover:bg-[#00FF66]/10 rounded-md cursor-pointer transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-[#9bb09b] hover:text-[#ff5577] bg-[#1a2a1a] hover:bg-[#ff5577]/10 rounded-md cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
