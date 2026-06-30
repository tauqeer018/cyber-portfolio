import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export function SkillsManager() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    category: '', items: ''
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    const { data } = await supabase.from('skills').select('*').order('created_at', { ascending: true });
    if (data) setSkills(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if(!confirm('Are you sure?')) return;
    await supabase.from('skills').delete().eq('id', id);
    fetchSkills();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    let parsedItems = [];
    try {
      parsedItems = JSON.parse(formData.items);
    } catch {
      alert("Items must be valid JSON array. e.g. [{\"name\": \"React\", \"level\": 90}]");
      return;
    }

    const payload = {
      category: formData.category,
      items: parsedItems
    };

    if (editingId === 'new') {
      await supabase.from('skills').insert([payload]);
    } else {
      await supabase.from('skills').update(payload).eq('id', editingId);
    }
    setEditingId(null);
    fetchSkills();
  }

  function startEdit(s: any) {
    setEditingId(s.id);
    setFormData({
      category: s.category,
      items: JSON.stringify(s.items, null, 2)
    });
  }

  function startNew() {
    setEditingId('new');
    setFormData({
      category: '', items: '[]'
    });
  }

  if (loading) return <div className="animate-pulse font-mono text-[#00FF66]">Loading data...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-[#1a2a1a] pb-4">
        <h2 className="text-xl font-mono text-white uppercase tracking-widest">
          <span className="text-[#00FF66] mr-3">_</span> Skills Registry
        </h2>
        {!editingId && (
          <button onClick={startNew} className="flex items-center gap-2 text-[#00FF66] hover:text-white bg-[#00FF66]/10 px-3 py-1.5 rounded-md font-mono text-[12px] uppercase tracking-widest transition-colors cursor-pointer border border-[#00FF66]/30">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        )}
      </div>

      {editingId ? (
        <form onSubmit={handleSave} className="bg-[#020602] border border-[#1a2a1a] rounded-xl p-6 space-y-4 font-mono text-[12px]">
          <label className="block">
            <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Category Name</span>
            <input required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-white outline-none focus:border-[#00FF66]" placeholder="e.g. Offensive Security" />
          </label>
          <label className="block">
            <span className="text-[#4A4D53] uppercase tracking-widest block mb-2">Items (JSON Array)</span>
            <textarea required rows={6} value={formData.items} onChange={e=>setFormData({...formData, items: e.target.value})} className="w-full bg-black border border-[#1a2a1a] rounded p-3 text-[#00FF66] outline-none focus:border-[#00FF66] font-mono text-[11px] resize-none" placeholder={`[\n  { "name": "React", "level": 90 }\n]`} />
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
          {skills.length === 0 && <p className="opacity-50 font-mono text-[12px]">No skills found. Add one above.</p>}
          {skills.map(s => (
            <div key={s.id} className="bg-[#020602] border border-[#1a2a1a] rounded-xl p-6 flex justify-between items-center group hover:border-[#00FF66]/30 transition-colors">
              <div>
                <h3 className="text-white font-mono uppercase tracking-widest text-[14px]">{s.category}</h3>
                <p className="text-[#4A4D53] font-mono text-[12px] mt-1">{s.items.length} items</p>
              </div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(s)} className="p-2 text-[#9bb09b] hover:text-[#00FF66] bg-[#1a2a1a] hover:bg-[#00FF66]/10 rounded-md cursor-pointer transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-[#9bb09b] hover:text-[#ff5577] bg-[#1a2a1a] hover:bg-[#ff5577]/10 rounded-md cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
