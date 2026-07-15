import { useState, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, Save, Plus, Trash2, LogOut, RotateCcw, Check, Upload, Image, Video, X, Loader2, Cloud, AlertCircle, Globe } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { uploadToCloudinary, isCloudinaryConfigured, getCloudinaryConfig, setCloudinaryConfig, getVideoDuration, formatDuration } from '../hooks/useUpload';
import type { Project } from '../models/types';

type AdminTab = 'projects' | 'profile' | 'settings';

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
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Enter password" className="w-full px-4 py-3 border border-border rounded-xl bg-card text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" autoFocus />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-3 bg-foreground text-background rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">Enter</button>
        </form>
      </div>
    </div>
  );
}

export function AdminPanel({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [toast, setToast] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const { logout } = useAdminAuth();
  const { publish } = usePortfolio();

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const onPublish = async () => {
    setIsPublishing(true);
    showToast('📤 Publishing to website...');
    const result = await publish();
    setIsPublishing(false);
    if (result.success) {
      showToast('✅ Published! Changes will be live in 1-2 minutes.');
    } else {
      showToast(`❌ Publish failed: ${result.error || 'Unknown error'}`);
    }
  };

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'projects', label: 'Projects', icon: <Video size={14} /> },
    { key: 'profile', label: 'Profile', icon: <Image size={14} /> },
    { key: 'settings', label: 'Settings', icon: <Cloud size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={16} /> Portfolio</button>
            <span className="text-border">|</span>
            <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onPublish} disabled={isPublishing} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
              {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
            <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><LogOut size={14} /> Logout</button>
          </div>
        </div>
      </div>

      {isCloudinaryConfigured() && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-2">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Globe size={14} className="text-green-600 shrink-0" />
            <p className="text-xs text-green-800">
              <strong>Auto-publish enabled.</strong> Every save is published to your website. Changes go live in 1-2 minutes.
            </p>
          </div>
        </div>
      )}

      {!isCloudinaryConfigured() && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Cloudinary not configured.</strong> Go to <button onClick={() => setActiveTab('settings')} className="underline font-medium">Settings</button> to set up cloud storage for video uploads.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-1 mb-8">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.key ? 'bg-foreground text-background' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'projects' && <ProjectsManager showToast={showToast} />}
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

/* ===================== FILE UPLOAD ZONE ===================== */
function FileUploadZone({ onFileSelect, accept = 'video/*,image/*', label = 'Upload Video', isUploading, uploadProgress, currentUrl, currentThumbnail, onRemove }: {
  onFileSelect: (file: File) => void; accept?: string; label?: string; isUploading?: boolean; uploadProgress?: number; currentUrl?: string; currentThumbnail?: string; onRemove?: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [thumbError, setThumbError] = useState(false);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) onFileSelect(file); }, [onFileSelect]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) onFileSelect(file); if (inputRef.current) inputRef.current.value = ''; };

  if (currentUrl && !isUploading) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium">{label}</label>
        <div className="relative rounded-xl overflow-hidden border border-border bg-black">
          <div className="aspect-video">
            <video
              src={currentUrl}
              className="w-full h-full object-contain"
              muted
              playsInline
              controls
              poster={currentThumbnail && !thumbError ? currentThumbnail : undefined}
              onError={() => setThumbError(true)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-green-600 font-medium">✓ Video uploaded</span>
          <div className="flex gap-2">
            <button onClick={() => inputRef.current?.click()} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 bg-secondary rounded-lg">Replace</button>
            {onRemove && <button onClick={onRemove} className="text-xs text-red-500 hover:text-red-600 px-2 py-1 bg-red-50 rounded-lg">Remove</button>}
          </div>
        </div>
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>
      <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => !isUploading && inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-foreground bg-foreground/5 scale-[1.02]' : 'border-border hover:border-foreground/30 hover:bg-secondary/30'} ${isUploading ? 'pointer-events-none' : ''}`}>
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
        {isUploading ? (
          <div className="space-y-4">
            <Loader2 size={32} className="mx-auto animate-spin text-foreground/60" />
            <div>
              <p className="text-sm font-medium mb-2">Uploading... {uploadProgress}%</p>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-foreground rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} /></div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto"><Upload size={24} className="text-muted-foreground" /></div>
            <div>
              <p className="text-sm font-medium">Drop your file here or <span className="text-foreground underline">browse</span></p>
              <p className="text-xs text-muted-foreground mt-1">Supports MP4, MOV, WEBM, AVI • No size limit</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== THUMBNAIL UPLOAD ===================== */
function ThumbnailUpload({ onFileSelect, currentThumbnail, onRemove }: { onFileSelect: (file: File) => void; currentThumbnail?: string; onRemove?: () => void; }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [thumbError, setThumbError] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) onFileSelect(file); if (inputRef.current) inputRef.current.value = ''; };

  // Detect if thumbnail is a data URI (local extraction) vs Cloudinary URL
  const isDataUri = currentThumbnail?.startsWith('data:');
  const isCloudinaryUrl = currentThumbnail?.includes('cloudinary.com') || currentThumbnail?.includes('pexels.com');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Thumbnail</label>
      {currentThumbnail && !thumbError ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img src={currentThumbnail} alt="Thumbnail" className="w-full max-w-md aspect-video object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" onError={() => setThumbError(true)} />
          {isDataUri && <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded-md backdrop-blur-sm">Local preview — will be replaced on upload</div>}
          <div className="absolute top-2 right-2 flex gap-1">
            <button onClick={() => inputRef.current?.click()} className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 text-xs">✎</button>
            {onRemove && <button onClick={onRemove} className="w-7 h-7 rounded-lg bg-red-500/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600"><X size={12} /></button>}
          </div>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()} className="rounded-xl border-2 border-dashed border-border p-6 text-center cursor-pointer hover:border-foreground/30 hover:bg-secondary/30 transition-all">
          <Image size={20} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">Upload thumbnail image</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">PNG, JPG, WEBP</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  );
}

/* ===================== PROJECTS ===================== */
function ProjectsManager({ showToast }: { showToast: (msg: string) => void }) {
  const { projects, updateProjects } = usePortfolio();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVideoUpload = async (file: File) => {
    if (!editingProject) return;
    if (!isCloudinaryConfigured()) { showToast('⚠️ Cloudinary not configured. Go to Settings.'); return; }
    setIsUploading(true); setUploadProgress(0);
    try {
      // Upload to Cloudinary first
      const result = await uploadToCloudinary(file, { onProgress: setUploadProgress, resourceType: 'video' });
      
      // Get duration from Cloudinary result or try locally
      let duration = editingProject.duration;
      if (result.duration) {
        duration = formatDuration(result.duration);
      } else {
        try { const dur = await getVideoDuration(file); duration = formatDuration(dur); } catch { /* ignore */ }
      }
      
      // Use Cloudinary's auto-generated thumbnail (always works, always .jpg)
      // Fall back to local extraction only if Cloudinary thumbnail fails
      setEditingProject(prev => prev ? { 
        ...prev, 
        videoUrl: result.url, 
        thumbnailUrl: result.thumbnailUrl, 
        duration: duration || prev.duration 
      } : prev);
      showToast('✅ Video uploaded!');
    } catch (err) {
      showToast(`❌ Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally { setIsUploading(false); setUploadProgress(0); }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!editingProject) return;
    if (!isCloudinaryConfigured()) {
      const reader = new FileReader();
      reader.onload = (e) => { setEditingProject(prev => prev ? { ...prev, thumbnailUrl: e.target?.result as string } : prev); };
      reader.readAsDataURL(file); return;
    }
    try {
      const result = await uploadToCloudinary(file, { resourceType: 'image' });
      setEditingProject(prev => prev ? { ...prev, thumbnailUrl: result.thumbnailUrl } : prev);
      showToast('✅ Thumbnail uploaded!');
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => { setEditingProject(prev => prev ? { ...prev, thumbnailUrl: e.target?.result as string } : prev); };
      reader.readAsDataURL(file);
    }
  };

  const saveProject = async () => {
    if (!editingProject) return;
    let updatedProjects: Project[];
    const exists = projects.find(p => p.id === editingProject.id);
    if (exists) { updatedProjects = projects.map(p => p.id === editingProject.id ? editingProject : p); }
    else { updatedProjects = [editingProject, ...projects]; }
    // Renumber so id always matches display order (1 = first/newest)
    updatedProjects = updatedProjects.map((p, i) => ({ ...p, id: i + 1 }));
    updateProjects(updatedProjects);
    setEditingProject(null);
    showToast('Project saved! Publishing...');
    const result = await publish();
    if (result.success) showToast('✅ Published! Live in 1-2 min.');
    else showToast('⚠️ Saved locally. Click Publish to go live.');
  };

  const deleteProject = async (id: number) => {
    if (confirm('Delete this project?')) {
      updateProjects(projects.filter(p => p.id !== id));
      showToast('Project deleted. Publishing...');
      const result = await publish();
      if (result.success) showToast('✅ Published! Live in 1-2 min.');
    }
  };

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;
    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
    updateProjects(newProjects);
    showToast(`Moved ${direction}. Publishing...`);
    const result = await publish();
    if (result.success) showToast('✅ Published! Live in 1-2 min.');
  };

  const addNewProject = () => {
    setEditingProject({ id: 0, title: '', category: 'commercial', videoUrl: '', thumbnailUrl: '', client: '', duration: '', year: new Date().getFullYear().toString(), description: '', software: [], role: 'Editor' });
  };

  if (editingProject) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{editingProject.videoUrl || editingProject.thumbnailUrl ? 'Edit' : 'New'} Project</h2>
          <div className="flex gap-2">
            <button onClick={() => setEditingProject(null)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
            <button onClick={saveProject} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90"><Save size={14} /> Save</button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <FileUploadZone onFileSelect={handleVideoUpload} label="📹 Video File" isUploading={isUploading} uploadProgress={uploadProgress} currentUrl={editingProject.videoUrl} currentThumbnail={editingProject.thumbnailUrl} onRemove={() => setEditingProject({ ...editingProject, videoUrl: '' })} />
        </div>

        <div className="mb-6">
          <ThumbnailUpload onFileSelect={handleThumbnailUpload} currentThumbnail={editingProject.thumbnailUrl} onRemove={() => setEditingProject({ ...editingProject, thumbnailUrl: '' })} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium mb-2">Title</label><input type="text" value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="My Amazing Project" /></div>
          <div><label className="block text-sm font-medium mb-2">Category</label><select value={editingProject.category} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as Project['category'] })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card"><option value="commercial">Commercial</option><option value="documentary">Documentary</option><option value="music">Music Video</option><option value="corporate">Corporate</option><option value="short">Short Film</option></select></div>
          <div><label className="block text-sm font-medium mb-2">Client</label><input type="text" value={editingProject.client} onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
          <div><label className="block text-sm font-medium mb-2">Duration <span className="font-normal text-muted-foreground">(auto-filled)</span></label><input type="text" value={editingProject.duration} onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="2:30" /></div>
          <div><label className="block text-sm font-medium mb-2">Year</label><input type="text" value={editingProject.year} onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
          <div><label className="block text-sm font-medium mb-2">Role</label><input type="text" value={editingProject.role} onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Software</label><input type="text" value={editingProject.software.join(', ')} onChange={(e) => setEditingProject({ ...editingProject, software: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Premiere Pro, After Effects, DaVinci Resolve" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Description</label><textarea value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card min-h-[100px]" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Video URL <span className="font-normal text-muted-foreground">(auto-filled on upload, or paste direct .mp4 link)</span></label><input type="text" value={editingProject.videoUrl} onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card font-mono text-xs" placeholder="https://res.cloudinary.com/..." /></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Projects ({projects.length})</h2>
        <button onClick={addNewProject} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90"><Plus size={14} /> Add Project</button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Use ↑ ↓ arrows to reorder projects. First project appears at the top of your portfolio.</p>
      {projects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Video size={32} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-1">No projects yet</p>
          <p className="text-sm">Upload your first video to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project, index) => (
            <div key={project.id} className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow">
              {/* Position number */}
              <span className="text-xs font-mono text-muted-foreground/50 w-5 text-center shrink-0">{index + 1}</span>

              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => moveProject(index, 'up')} disabled={index === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-default transition-colors" aria-label="Move up">
                  <ArrowUp size={12} />
                </button>
                <button onClick={() => moveProject(index, 'down')} disabled={index === projects.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-default transition-colors" aria-label="Move down">
                  <ArrowDown size={12} />
                </button>
              </div>

              {/* Thumbnail */}
              {project.thumbnailUrl ? (
                <img src={project.thumbnailUrl} alt="" className="w-20 h-12 rounded-lg object-cover flex-shrink-0" crossOrigin="anonymous" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="w-20 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0"><Video size={16} className="text-muted-foreground" /></div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{project.title || 'Untitled'}</p>
                <p className="text-xs text-muted-foreground">{project.client || 'No client'} • {project.year} • {project.category}{project.videoUrl && ' • ✅ Video'}</p>
              </div>

              {/* Actions */}
              <button onClick={() => setEditingProject({ ...project })} className="px-3 py-1.5 text-xs font-medium bg-secondary rounded-lg hover:bg-secondary/80">Edit</button>
              <button onClick={() => deleteProject(project.id)} className="p-1.5 text-muted-foreground hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
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

  const save = async () => {
    updateOwner(owner);
    const parsedSkills = skillText.split('\n').map(line => { const [name, level] = line.split(':').map(s => s.trim()); return { name: name || '', level: parseInt(level) || 50 }; }).filter(s => s.name);
    updateSkills(parsedSkills);
    showToast('Profile saved! Publishing...');
    const result = await publish();
    if (result.success) showToast('✅ Published! Live in 1-2 min.');
    else showToast('⚠️ Saved locally. Click Publish to go live.');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Profile</h2>
        <button onClick={save} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90"><Save size={14} /> Save</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium mb-2">Studio Name</label><input type="text" value={owner.name} onChange={(e) => setOwner({ ...owner, name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
        <div><label className="block text-sm font-medium mb-2">Title</label><input type="text" value={owner.title} onChange={(e) => setOwner({ ...owner, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Bio</label><textarea value={owner.bio} onChange={(e) => setOwner({ ...owner, bio: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card min-h-[100px]" /></div>
        <div><label className="block text-sm font-medium mb-2">Experience (years)</label><input type="number" value={owner.experience} onChange={(e) => setOwner({ ...owner, experience: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
        <div><label className="block text-sm font-medium mb-2">Skills <span className="font-normal text-muted-foreground">(one per line: Name:level)</span></label><textarea value={skillText} onChange={(e) => setSkillText(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card min-h-[140px] font-mono text-xs" placeholder="Premiere Pro:95&#10;After Effects:85" /></div>
      </div>
    </div>
  );
}

/* ===================== SETTINGS ===================== */
function SettingsManager({ showToast }: { showToast: (msg: string) => void }) {
  const { resetAll } = usePortfolio();
  const config = getCloudinaryConfig();
  const [cloudName, setCloudName] = useState(config.cloudName);
  const [uploadPreset, setUploadPreset] = useState(config.uploadPreset);

  const saveCloudinary = () => { setCloudinaryConfig({ cloudName, uploadPreset }); showToast('✅ Cloudinary config saved!'); };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Settings</h2>

      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Cloud size={18} className="text-blue-600" /></div>
          <div><h3 className="font-bold text-sm">Cloudinary Storage</h3><p className="text-xs text-muted-foreground">Required for video & image uploads</p></div>
          {isCloudinaryConfigured() ? <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">✓ Connected</span> : <span className="ml-auto px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">Not configured</span>}
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-2">Cloud Name</label><input type="text" value={cloudName} onChange={(e) => setCloudName(e.target.value)} placeholder="your-cloud-name" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card font-mono" /><p className="text-[10px] text-muted-foreground mt-1">Found in Cloudinary Dashboard → Account Details</p></div>
          <div><label className="block text-sm font-medium mb-2">Upload Preset</label><input type="text" value={uploadPreset} onChange={(e) => setUploadPreset(e.target.value)} placeholder="yuz_portfolio" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card font-mono" /><p className="text-[10px] text-muted-foreground mt-1">Settings → Upload → Upload Presets → Add Upload Preset → Signing Mode: <strong>Unsigned</strong></p></div>
          <button onClick={saveCloudinary} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90"><Save size={14} /> Save Configuration</button>
        </div>
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-xs font-bold text-muted-foreground tracking-wide uppercase mb-3">Setup Guide</h4>
          <ol className="text-xs text-muted-foreground space-y-2 list-decimal pl-4 leading-relaxed">
            <li>Create a <strong>free account</strong> at <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">cloudinary.com</a></li>
            <li>Go to <strong>Settings → Upload → Upload Presets</strong></li>
            <li>Click <strong>"Add Upload Preset"</strong></li>
            <li>Set <strong>Signing Mode</strong> to <strong>"Unsigned"</strong></li>
            <li>Give it a name (e.g., <code className="bg-secondary px-1 rounded">yuz_portfolio</code>) and save</li>
            <li>Copy your <strong>Cloud Name</strong> from the dashboard and paste above</li>
            <li>Enter the upload preset name and click <strong>Save Configuration</strong></li>
          </ol>
          <p className="text-[10px] text-muted-foreground mt-3">Free tier includes: 25 GB storage, 25 GB bandwidth/month — plenty for a portfolio!</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-bold text-sm mb-3">How It Works</h3>
        <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 leading-relaxed">
          <li>Videos are <strong>uploaded from your device</strong> to Cloudinary cloud storage</li>
          <li>Thumbnails are <strong>auto-generated</strong> from the first frame of your video</li>
          <li>Every save <strong>auto-publishes</strong> your changes to the live website</li>
          <li>All visitors see the <strong>same published data</strong> — not just your browser</li>
          <li>Changes go live in <strong>1-2 minutes</strong> after publishing</li>
          <li>Video duration is <strong>auto-detected</strong> from the file</li>
          <li>Supports: MP4, MOV, WEBM, AVI and more</li>
        </ul>
      </div>

      <div className="bg-card border border-red-200 rounded-xl p-6">
        <h3 className="font-bold text-sm mb-3 text-red-600">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-4">Reset all portfolio data to defaults. This cannot be undone.</p>
        <button onClick={() => { if (confirm('Reset all data to defaults?')) { resetAll(); showToast('Data reset'); } }} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"><RotateCcw size={14} /> Reset All Data</button>
      </div>
    </div>
  );
}
