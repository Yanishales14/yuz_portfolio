import { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2, LogOut, RotateCcw, Check, Link, Loader2 } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { extractYouTubeId, getYouTubeThumbnail, fetchYouTubeMeta, isValidYouTubeUrl } from '../hooks/useYouTube';
import { metaFetchLimiter } from '../hooks/useRateLimit';
import type { Project } from '../models/types';

type AdminTab = 'projects' | 'profile' | 'showreel' | 'settings';

export function AdminLogin({ onLogin }: { onLogin: (password: string) => { success: boolean; error?: string } }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onLogin(password);
    if (!result.success) {
      setError(result.error || 'Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            YUZ<span className="font-light text-muted-foreground">Studio</span>
          </h1>
          <p className="text-sm text-muted-foreground">Enter the passphrase to manage your portfolio</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Enter password"
            className="w-full px-4 py-3 border border-border rounded-xl bg-card text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            autoFocus
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-3 bg-foreground text-background rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminPanel({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [toast, setToast] = useState<string | null>(null);
  const { logout } = useAdminAuth();

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const tabs: { key: AdminTab; label: string }[] = [
    { key: 'projects', label: 'Projects' },
    { key: 'showreel', label: 'Showreel' },
    { key: 'profile', label: 'Profile' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} /> Portfolio
            </button>
            <span className="text-border">|</span>
            <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin</h1>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-1 mb-8">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-foreground text-background' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'projects' && <ProjectsManager showToast={showToast} />}
        {activeTab === 'showreel' && <ShowreelManager showToast={showToast} />}
        {activeTab === 'profile' && <ProfileManager showToast={showToast} />}
        {activeTab === 'settings' && <SettingsManager showToast={showToast} />}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-foreground text-background px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 z-50">
          <Check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

/* ===================== PROJECTS ===================== */
function ProjectsManager({ showToast }: { showToast: (msg: string) => void }) {
  const { projects, updateProjects } = usePortfolio();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  const handleYouTubeUrlChange = async (url: string) => {
    if (!editingProject) return;
    const videoId = extractYouTubeId(url);

    setEditingProject({ ...editingProject, youtubeUrl: url, videoId: videoId || '' });

    if (videoId && metaFetchLimiter.check()) {
      setFetchingMeta(true);
      try {
        const meta = await fetchYouTubeMeta(url);
        if (meta && editingProject) {
          setEditingProject(prev => prev ? {
            ...prev,
            title: prev.title || meta.title,
            videoId,
          } : prev);
          showToast('Metadata extracted!');
        }
      } catch { /* ignore */ }
      finally { setFetchingMeta(false); }
    }
  };

  const saveProject = () => {
    if (!editingProject) return;
    const exists = projects.find(p => p.id === editingProject.id);
    if (exists) {
      updateProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    } else {
      updateProjects([...projects, editingProject]);
    }
    setEditingProject(null);
    showToast('Project saved!');
  };

  const deleteProject = (id: number) => {
    if (confirm('Delete this project?')) {
      updateProjects(projects.filter(p => p.id !== id));
      showToast('Project deleted');
    }
  };

  const addNewProject = () => {
    const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
    setEditingProject({ id: newId, title: '', category: 'commercial', youtubeUrl: '', videoId: '', client: '', duration: '', year: new Date().getFullYear().toString(), description: '', software: ['Premiere Pro'], role: 'Editor' });
  };

  if (editingProject) {
    const thumbnail = editingProject.videoId ? getYouTubeThumbnail(editingProject.videoId, 'hq') : '';

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{editingProject.title ? 'Edit' : 'New'} Project</h2>
          <div className="flex gap-2">
            <button onClick={() => setEditingProject(null)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
            <button onClick={saveProject} disabled={!editingProject.videoId} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-40">
              <Save size={14} /> Save
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <label className="block text-sm font-medium mb-2 text-blue-900">YouTube URL</label>
          <div className="flex gap-2">
            <input type="text" value={editingProject.youtubeUrl} onChange={(e) => handleYouTubeUrlChange(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="flex-1 px-4 py-3 border border-blue-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
            {fetchingMeta && <div className="flex items-center px-3"><Loader2 size={16} className="animate-spin text-blue-500" /></div>}
          </div>
          {editingProject.videoId && <p className="text-xs text-blue-600 mt-2 flex items-center gap-1"><Check size={12} /> Video detected — ID: {editingProject.videoId}</p>}
          {!editingProject.videoId && editingProject.youtubeUrl && <p className="text-xs text-red-500 mt-2">Could not detect video ID. Make sure the URL is a valid YouTube link.</p>}
        </div>

        {thumbnail && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Thumbnail Preview</label>
            <img src={thumbnail} alt="Thumbnail" className="w-full max-w-md aspect-video rounded-xl object-cover border border-border" />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title <span className="text-muted-foreground font-normal">(auto-filled from YouTube)</span></label>
            <input type="text" value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select value={editingProject.category} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as Project['category'] })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card">
              <option value="commercial">Commercial</option>
              <option value="documentary">Documentary</option>
              <option value="music">Music Video</option>
              <option value="corporate">Corporate</option>
              <option value="short">Short Film</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-2">Client</label><input type="text" value={editingProject.client} onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
          <div><label className="block text-sm font-medium mb-2">Duration</label><input type="text" value={editingProject.duration} onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="2:30" /></div>
          <div><label className="block text-sm font-medium mb-2">Year</label><input type="text" value={editingProject.year} onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
          <div><label className="block text-sm font-medium mb-2">Role</label><input type="text" value={editingProject.role} onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Software (comma-separated)</label><input type="text" value={editingProject.software.join(', ')} onChange={(e) => setEditingProject({ ...editingProject, software: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Premiere Pro, After Effects" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Description</label><textarea value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card min-h-[100px]" /></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Projects ({projects.length})</h2>
        <button onClick={addNewProject} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90">
          <Plus size={14} /> Add Project
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Link size={32} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-1">No projects yet</p>
          <p className="text-sm">Add your first YouTube video to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow">
              {project.videoId ? (
                <img src={getYouTubeThumbnail(project.videoId, 'default')} alt="" className="w-20 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0"><Link size={16} className="text-muted-foreground" /></div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{project.title || 'Untitled'}</p>
                <p className="text-xs text-muted-foreground">{project.client} • {project.year} • {project.category}</p>
              </div>
              <button onClick={() => setEditingProject({ ...project })} className="px-3 py-1.5 text-xs font-medium bg-secondary rounded-lg hover:bg-secondary/80">Edit</button>
              <button onClick={() => deleteProject(project.id)} className="p-1.5 text-muted-foreground hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===================== SHOWREEL ===================== */
function ShowreelManager({ showToast }: { showToast: (msg: string) => void }) {
  const { showreelVideoId, updateShowreelVideoId } = usePortfolio();
  const [videoId, setVideoId] = useState(showreelVideoId);
  const [url, setUrl] = useState(showreelVideoId ? `https://www.youtube.com/watch?v=${showreelVideoId}` : '');

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    const id = extractYouTubeId(newUrl);
    setVideoId(id || '');
  };

  const save = () => {
    updateShowreelVideoId(videoId);
    showToast('Showreel saved!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Showreel</h2>
        <button onClick={save} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90">
          <Save size={14} /> Save
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Set the YouTube video that will be displayed as your featured showreel.</p>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">YouTube URL</label>
        <input type="text" value={url} onChange={(e) => handleUrlChange(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" />
        {videoId && <p className="text-xs text-green-600 mt-1"><Check size={12} className="inline" /> Video ID: {videoId}</p>}
      </div>
      {videoId && (
        <div className="aspect-video rounded-xl overflow-hidden border border-border max-w-2xl">
          <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Showreel preview" />
        </div>
      )}
    </div>
  );
}

/* ===================== PROFILE ===================== */
function ProfileManager({ showToast }: { showToast: (msg: string) => void }) {
  const { portfolioOwner, updateOwner, skills, updateSkills } = usePortfolio();
  const [owner, setOwner] = useState({ ...portfolioOwner });
  const [skillText, setSkillText] = useState(skills.map(s => `${s.name}:${s.level}`).join('\n'));

  const save = () => {
    updateOwner(owner);
    const parsedSkills = skillText.split('\n').map(line => {
      const [name, level] = line.split(':').map(s => s.trim());
      return { name: name || '', level: parseInt(level) || 50 };
    }).filter(s => s.name);
    updateSkills(parsedSkills);
    showToast('Profile saved!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Profile</h2>
        <button onClick={save} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90">
          <Save size={14} /> Save
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium mb-2">Studio Name</label><input type="text" value={owner.name} onChange={(e) => setOwner({ ...owner, name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
        <div><label className="block text-sm font-medium mb-2">Title</label><input type="text" value={owner.title} onChange={(e) => setOwner({ ...owner, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Bio</label><textarea value={owner.bio} onChange={(e) => setOwner({ ...owner, bio: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card min-h-[100px]" /></div>
        <div><label className="block text-sm font-medium mb-2">Experience (years)</label><input type="number" value={owner.experience} onChange={(e) => setOwner({ ...owner, experience: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
        <div>
          <label className="block text-sm font-medium mb-2">Skills <span className="font-normal text-muted-foreground">(one per line: Name:level)</span></label>
          <textarea value={skillText} onChange={(e) => setSkillText(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card min-h-[140px] font-mono text-xs" placeholder="Premiere Pro:95&#10;After Effects:85" />
        </div>
      </div>
    </div>
  );
}

/* ===================== SETTINGS ===================== */
function SettingsManager({ showToast }: { showToast: (msg: string) => void }) {
  const { resetAll } = usePortfolio();

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Settings</h2>
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-bold text-sm mb-3">How It Works</h3>
        <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 leading-relaxed">
          <li>Videos are embedded from <strong>YouTube only</strong> — no uploads needed</li>
          <li>Paste any YouTube URL and the thumbnail + title are extracted automatically</li>
          <li>Supported formats: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, etc.</li>
          <li>All data is stored in your browser's localStorage</li>
          <li>Admin password is required every session (no saved login)</li>
          <li>Rate limit: 5 login attempts per 15 minutes</li>
        </ul>
      </div>
      <div className="bg-card border border-red-200 rounded-xl p-6">
        <h3 className="font-bold text-sm mb-3 text-red-600">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-4">Reset all portfolio data to defaults. This cannot be undone.</p>
        <button onClick={() => { if (confirm('Reset all data to defaults?')) { resetAll(); showToast('Data reset'); } }} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
          <RotateCcw size={14} /> Reset All Data
        </button>
      </div>
    </div>
  );
}
