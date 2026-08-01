import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import './admin.css';

function Admin() {
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [readIds, setReadIds] = useState(new Set());
  const [projects, setProjects] = useState([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [msgSearch, setMsgSearch] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Project form state
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', long_description: '', technologies: '', link: '', image_url: '', imageFile: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');

  const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  const fetchAdminData = () => {
    axios.get('/api/admin/messages', authHeader())
      .then(res => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch(err => { if (err.response?.status === 401) handleLogout(); });

    axios.get('/api/projects')
      .then(res => setProjects(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  };

  useEffect(() => { if (isLoggedIn) fetchAdminData(); }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
      setError('');
    } catch {
      setError('Access Denied. Use Admin ID: "admin" and Passcode: "admin123"');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const markRead = (id) => {
    setReadIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const openAddProject = () => {
    setEditingId(null);
    setProjectForm({ title: '', description: '', long_description: '', technologies: '', link: '', image_url: '', imageFile: null });
    setImagePreview(null);
    setSaveMsg('');
    setIsProjectFormOpen(true);
  };

  const openEditProject = (p) => {
    setEditingId(p.id);
    setProjectForm({ title: p.title, description: p.description, long_description: p.long_description, technologies: p.technologies, link: p.link, image_url: p.image_url, imageFile: null });
    setImagePreview(p.image_url ? `/${p.image_url}` : null);
    setSaveMsg('');
    setIsProjectFormOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectForm(f => ({ ...f, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', projectForm.title);
    fd.append('description', projectForm.description);
    fd.append('long_description', projectForm.long_description);
    fd.append('technologies', projectForm.technologies);
    fd.append('link', projectForm.link);
    if (projectForm.image_url) fd.append('image_url', projectForm.image_url);
    if (projectForm.imageFile) fd.append('image', projectForm.imageFile);

    const cfg = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } };
    try {
      if (editingId) {
        await axios.put(`/api/admin/projects/${editingId}`, fd, cfg);
      } else {
        await axios.post('/api/admin/projects', fd, cfg);
      }
      setSaveMsg('✅ Project saved successfully!');
      setTimeout(() => { setIsProjectFormOpen(false); fetchAdminData(); }, 1200);
    } catch {
      setSaveMsg('❌ Failed to save project. Please try again.');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      await axios.delete(`/api/admin/projects/${id}`, authHeader());
      fetchAdminData();
    } catch { alert('Failed to delete'); }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await axios.delete(`/api/admin/messages/${id}`, authHeader());
      fetchAdminData();
    } catch { alert('Failed to delete'); }
  };

  const replyByEmail = (email, name) => {
    const subject = encodeURIComponent(`Re: Your message — Girma Ashetu`);
    const body = encodeURIComponent(`Hi ${name},\n\nThank you for reaching out through my portfolio. I'd be happy to connect!\n\n— Girma Ashetu\ngirme405@gmail.com`);
    window.open(`https://mail.google.com/mail/?view=cm&to=${email}&su=${subject}&body=${body}`, '_blank', 'noopener,noreferrer');
  };

  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.technologies?.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredMessages = messages.filter(m =>
    m.name?.toLowerCase().includes(msgSearch.toLowerCase()) ||
    m.email?.toLowerCase().includes(msgSearch.toLowerCase()) ||
    m.message?.toLowerCase().includes(msgSearch.toLowerCase())
  );

  const unreadCount = messages.filter(m => !readIds.has(m.id)).length;

  // ── Login Screen ─────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-bg-glow" />
        <div className="login-panel reveal-up">
          {/* Theme toggle on login */}
          <div className="login-theme-row">
            <button type="button" className="admin-theme-converter-btn" onClick={toggleTheme}>
              {theme === 'dark'
                ? <><i className="fas fa-sun" /><span>Light Mode</span></>
                : <><i className="fas fa-moon" /><span>Dark Mode</span></>
              }
            </button>
          </div>

          <div className="login-icon-wrap">
            <i className="fas fa-fingerprint" />
            <div className="login-icon-ring" />
          </div>
          <h2 className="admin-login-title">System Access</h2>
          <p className="admin-login-sub">Authenticated administrators only</p>

          {error && (
            <div className="admin-login-error">
              <i className="fas fa-exclamation-triangle me-2" />{error}
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="input-master-wrapper mb-4">
              <input
                type="text"
                className="input-master"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder=" "
                autoComplete="username"
              />
              <label className={username ? 'active' : ''}>Admin ID</label>
              <div className="input-border-glow" />
            </div>
            <div className="input-master-wrapper mb-4">
              <input
                type="password"
                className="input-master"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder=" "
                autoComplete="current-password"
              />
              <label className={password ? 'active' : ''}>Passcode</label>
              <div className="input-border-glow" />
            </div>
            <button type="submit" className="btn-masterpiece-primary w-100 mt-2">
              <span className="btn-bg-slide" />
              <span className="btn-content" style={{ justifyContent: 'center' }}>
                <i className="fas fa-lock-open me-2" /> Authenticate
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand-icon">
            <i className="fas fa-shield-alt" />
          </div>
          <h5 className="admin-sidebar-title">Admin <span>Center</span></h5>
          <span className="admin-online-badge">
            <span className="status-pulse" />Online
          </span>
        </div>

        {/* Mode Converter */}
        <div className="admin-theme-converter-box">
          <span className="theme-converter-label">
            <i className="fas fa-palette me-1" /> Interface Mode
          </span>
          <button type="button" className="theme-converter-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark'
              ? <><i className="fas fa-moon" /> Cosmic Dark</>
              : <><i className="fas fa-sun" /> Daylight Mode</>
            }
          </button>
        </div>

        <nav className="admin-nav">
          {[
            { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard', badge: null },
            { id: 'projects', icon: 'fa-layer-group', label: 'Portfolio DB', badge: projects.length || null },
            { id: 'messages', icon: 'fa-envelope-open-text', label: 'Comm Logs', badge: unreadCount || null },
          ].map(item => (
            <div
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setIsProjectFormOpen(false); }}
            >
              <i className={`fas ${item.icon}`} />
              <span>{item.label}</span>
              {item.badge ? <span className="admin-nav-badge">{item.badge}</span> : null}
            </div>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <i className="fas fa-power-off" /> Terminate Session
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">

        {/* ── Dashboard Overview ── */}
        {activeTab === 'dashboard' && !isProjectFormOpen && (
          <div className="reveal-up">
            <div className="admin-page-header">
              <div>
                <h3 className="admin-page-title">Overview Metrics</h3>
                <p className="admin-page-sub">Real-time portfolio system status</p>
              </div>
              <button className="admin-refresh-btn" onClick={fetchAdminData} title="Refresh data">
                <i className="fas fa-sync-alt" />
              </button>
            </div>

            <div className="dashboard-widget-grid">
              <div className="admin-widget" onClick={() => setActiveTab('projects')} style={{ cursor: 'pointer' }}>
                <div className="widget-icon-box widget-icon-primary">
                  <i className="fas fa-project-diagram" />
                </div>
                <div className="widget-info">
                  <h5>Total Projects</h5>
                  <h2>{projects.length}</h2>
                  <span className="widget-cta">View all →</span>
                </div>
              </div>
              <div className="admin-widget" onClick={() => setActiveTab('messages')} style={{ cursor: 'pointer' }}>
                <div className="widget-icon-box widget-icon-secondary">
                  <i className="fas fa-inbox" />
                </div>
                <div className="widget-info">
                  <h5>Total Messages</h5>
                  <h2>{messages.length}</h2>
                  {unreadCount > 0 && <span className="widget-unread-badge">{unreadCount} unread</span>}
                </div>
              </div>
              <div className="admin-widget">
                <div className="widget-icon-box widget-icon-accent">
                  <i className="fas fa-server" />
                </div>
                <div className="widget-info">
                  <h5>System Status</h5>
                  <h2 className="text-success" style={{ fontSize: '1.6rem' }}>Optimal</h2>
                  <span className="widget-cta" style={{ color: '#4ade80' }}>All systems go ✓</span>
                </div>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header">
                <h5 className="admin-panel-title">Recent Messages</h5>
                <button className="admin-view-all-btn" onClick={() => setActiveTab('messages')}>
                  View All <i className="fas fa-arrow-right ms-1" />
                </button>
              </div>
              {messages.slice(0, 3).length === 0 ? (
                <div className="admin-empty-state">
                  <i className="fas fa-wave-square" />
                  <p>No messages received yet. Share your portfolio!</p>
                </div>
              ) : (
                <div className="recent-messages-list">
                  {messages.slice(0, 3).map(msg => (
                    <div key={msg.id} className="recent-msg-row">
                      <div className="msg-avatar-sm"><i className="fas fa-user" /></div>
                      <div className="recent-msg-info">
                        <span className="recent-msg-name">{msg.name}</span>
                        <span className="recent-msg-preview">{msg.message?.substring(0, 60)}…</span>
                      </div>
                      <span className="recent-msg-time">
                        {new Date(msg.created_at || msg.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Projects DB ── */}
        {activeTab === 'projects' && !isProjectFormOpen && (
          <div className="reveal-up">
            <div className="admin-page-header">
              <div>
                <h3 className="admin-page-title">Portfolio Database</h3>
                <p className="admin-page-sub">{filteredProjects.length} of {projects.length} projects</p>
              </div>
              <button className="btn-masterpiece-primary btn-sm py-2 px-4" onClick={openAddProject}>
                <span className="btn-bg-slide" />
                <span className="btn-content"><i className="fas fa-plus me-2" />Deploy New</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="admin-search-bar mb-4">
              <i className="fas fa-search admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search by title or technology…"
                value={projectSearch}
                onChange={e => setProjectSearch(e.target.value)}
              />
              {projectSearch && (
                <button className="admin-search-clear" onClick={() => setProjectSearch('')}>
                  <i className="fas fa-times" />
                </button>
              )}
            </div>

            <div className="admin-panel">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Technologies</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="project-title-cell">
                            <img
                              src={`/${p.image_url}`}
                              alt=""
                              className="project-thumb"
                              onError={e => { e.target.src = '/project_ai.png'; }}
                            />
                            <div>
                              <div className="project-name">{p.title}</div>
                              <div className="project-desc-preview">{p.description?.substring(0, 50)}…</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="tech-tags">
                            {p.technologies?.split(',').slice(0, 3).map((t, i) => (
                              <span key={i} className="tech-tag">{t.trim()}</span>
                            ))}
                          </div>
                        </td>
                        <td className="text-end">
                          <button onClick={() => openEditProject(p)} className="action-btn edit" title="Edit">
                            <i className="fas fa-pen" />
                          </button>
                          <button onClick={() => handleDeleteProject(p.id)} className="action-btn delete" title="Delete">
                            <i className="fas fa-trash-alt" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProjects.length === 0 && (
                  <div className="admin-empty-state">
                    <i className="fas fa-search" />
                    <p>{projectSearch ? `No projects matching "${projectSearch}"` : 'No projects in database yet.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Project Form ── */}
        {isProjectFormOpen && (
          <div className="reveal-up">
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h4 className="admin-panel-title" style={{ color: 'var(--primary)' }}>
                  <i className={`fas ${editingId ? 'fa-pen' : 'fa-rocket'} me-2`} />
                  {editingId ? 'Edit Project' : 'Deploy New Project'}
                </h4>
                <button className="btn-close btn-close-white" onClick={() => setIsProjectFormOpen(false)} />
              </div>

              {saveMsg && (
                <div className={`admin-save-msg ${saveMsg.startsWith('✅') ? 'success' : 'error'}`}>
                  {saveMsg}
                </div>
              )}

              <form onSubmit={handleSaveProject} className="master-form">
                <div className="form-group-row mb-4">
                  <div className="input-master-wrapper">
                    <input type="text" className="input-master" required value={projectForm.title} onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))} placeholder=" " />
                    <label className={projectForm.title ? 'active' : ''}>Project Title *</label>
                    <div className="input-border-glow" />
                  </div>
                  <div className="input-master-wrapper">
                    <input type="text" className="input-master" required value={projectForm.technologies} onChange={e => setProjectForm(f => ({ ...f, technologies: e.target.value }))} placeholder=" " />
                    <label className={projectForm.technologies ? 'active' : ''}>Technologies (comma separated) *</label>
                    <div className="input-border-glow" />
                  </div>
                </div>

                <div className="input-master-wrapper mb-4">
                  <input type="text" className="input-master" required value={projectForm.link} onChange={e => setProjectForm(f => ({ ...f, link: e.target.value }))} placeholder=" " />
                  <label className={projectForm.link ? 'active' : ''}>Project Link / Repo URL *</label>
                  <div className="input-border-glow" />
                </div>

                <div className="input-master-wrapper mb-4">
                  <textarea className="input-master textarea-master" rows="2" required value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))} placeholder=" " />
                  <label className={projectForm.description ? 'active' : ''}>Short Description (Grid Card) *</label>
                  <div className="input-border-glow" />
                </div>

                <div className="input-master-wrapper mb-4">
                  <textarea className="input-master textarea-master" rows="4" required value={projectForm.long_description} onChange={e => setProjectForm(f => ({ ...f, long_description: e.target.value }))} placeholder=" " />
                  <label className={projectForm.long_description ? 'active' : ''}>Long Description (Modal Detail) *</label>
                  <div className="input-border-glow" />
                </div>

                {/* Image Upload */}
                <div className="admin-image-upload-area mb-4">
                  <div className="upload-preview-row">
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="upload-preview-thumb" />
                    )}
                    <label className="upload-file-label">
                      <i className="fas fa-cloud-upload-alt me-2" />
                      {imagePreview ? 'Change Image' : 'Upload Project Image'}
                      <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </label>
                  </div>
                  <p className="upload-hint">PNG, JPG, WebP — Max 5MB. Recommended: 800×500px</p>
                </div>

                <div className="d-flex justify-content-end gap-3 mt-4">
                  <button type="button" className="btn-masterpiece-outline" onClick={() => setIsProjectFormOpen(false)}>
                    <span className="btn-content">Cancel</span>
                  </button>
                  <button type="submit" className="btn-masterpiece-primary px-5">
                    <span className="btn-bg-slide" />
                    <span className="btn-content">
                      <i className="fas fa-save me-2" />{editingId ? 'Save Changes' : 'Deploy Project'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Messages Log ── */}
        {activeTab === 'messages' && !isProjectFormOpen && (
          <div className="reveal-up">
            <div className="admin-page-header">
              <div>
                <h3 className="admin-page-title">Communication Logs</h3>
                <p className="admin-page-sub">{filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''} {unreadCount > 0 ? `· ${unreadCount} unread` : ''}</p>
              </div>
              <button className="admin-refresh-btn" onClick={fetchAdminData} title="Refresh">
                <i className="fas fa-sync-alt" />
              </button>
            </div>

            {/* Search */}
            <div className="admin-search-bar mb-4">
              <i className="fas fa-search admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search messages…"
                value={msgSearch}
                onChange={e => setMsgSearch(e.target.value)}
              />
              {msgSearch && (
                <button className="admin-search-clear" onClick={() => setMsgSearch('')}>
                  <i className="fas fa-times" />
                </button>
              )}
            </div>

            {filteredMessages.length === 0 ? (
              <div className="admin-panel">
                <div className="admin-empty-state">
                  <i className="fas fa-satellite" />
                  <p>{msgSearch ? `No messages match "${msgSearch}"` : 'No messages received yet.'}</p>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {filteredMessages.map(msg => {
                  const isRead = readIds.has(msg.id);
                  return (
                    <div key={msg.id} className="col-lg-6">
                      <div className={`msg-card ${isRead ? 'msg-read' : 'msg-unread'}`}>
                        {!isRead && <div className="msg-unread-dot" title="Unread" />}
                        <div className="msg-header">
                          <div className="msg-avatar"><i className="fas fa-user" /></div>
                          <div>
                            <h5 className="msg-name">{msg.name}</h5>
                            <a href={`mailto:${msg.email}`} className="msg-email">{msg.email}</a>
                          </div>
                          <div className="msg-actions-right ms-auto d-flex gap-2">
                            <button
                              className="action-btn edit"
                              title="Reply via Gmail"
                              onClick={() => replyByEmail(msg.email, msg.name)}
                            >
                              <i className="fas fa-reply" />
                            </button>
                            <button
                              className={`action-btn ${isRead ? 'edit' : ''}`}
                              title={isRead ? 'Mark as unread' : 'Mark as read'}
                              onClick={() => markRead(msg.id)}
                            >
                              <i className={`fas ${isRead ? 'fa-envelope' : 'fa-envelope-open'}`} />
                            </button>
                            <button
                              className="action-btn delete"
                              title="Delete"
                              onClick={() => handleDeleteMessage(msg.id)}
                            >
                              <i className="fas fa-trash-alt" />
                            </button>
                          </div>
                        </div>
                        <div className="msg-body">"{msg.message}"</div>
                        <div className="msg-footer">
                          <span><i className="far fa-clock me-1" />{new Date(msg.created_at || msg.timestamp || Date.now()).toLocaleString()}</span>
                          <span className={`msg-status-badge ${isRead ? 'read' : 'unread'}`}>
                            {isRead ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default Admin;
