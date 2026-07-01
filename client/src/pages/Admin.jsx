import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.css';

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Project Form State
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', long_description: '', technologies: '', link: '', image_url: '', imageFile: null
  });
  // Preview for selected image
  const [imagePreview, setImagePreview] = useState(null);

  const fetchAdminData = () => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
    
    axios.get('/api/admin/messages', config)
      .then(res => setMessages(res.data))
      .catch(err => {
        if (err.response?.status === 401) handleLogout();
      });

    axios.get('/api/projects')
      .then(res => setProjects(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    if (isLoggedIn) fetchAdminData();
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      setError('Invalid credentials. Access Denied.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const openAddProject = () => {
    setEditingId(null);
    setProjectForm({ title: '', description: '', long_description: '', technologies: '', link: '', image_url: '', imageFile: null });
    setImagePreview(null);
    setIsProjectFormOpen(true);
  };

  const openEditProject = (project) => {
    setEditingId(project.id);
    setProjectForm({
      title: project.title,
      description: project.description,
      long_description: project.long_description,
      technologies: project.technologies,
      link: project.link,
      image_url: project.image_url,
      imageFile: null
    });
    setImagePreview(`/${project.image_url}`);
    setIsProjectFormOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectForm({ ...projectForm, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('long_description', projectForm.long_description);
    formData.append('technologies', projectForm.technologies);
    formData.append('link', projectForm.link);
    if (projectForm.image_url) formData.append('image_url', projectForm.image_url);
    if (projectForm.imageFile) formData.append('image', projectForm.imageFile);

    const config = { 
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      } 
    };
    try {
      if (editingId) {
        await axios.put(`/api/admin/projects/${editingId}`, formData, config);
      } else {
        await axios.post('/api/admin/projects', formData, config);
      }
      setIsProjectFormOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to save project');
    }
  };

  const handleDeleteProject = async (id) => {
    if(!window.confirm("CRITICAL WARNING: Are you sure you want to permanently delete this project?")) return;
    try {
      await axios.delete(`/api/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  const handleDeleteMessage = async (id) => {
    if(!window.confirm("Delete this transmission permanently?")) return;
    try {
      await axios.delete(`/api/admin/messages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete message');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="login-panel reveal-up">
          <i className="fas fa-fingerprint text-primary fa-4x mb-4" style={{ filter: 'drop-shadow(0 0 15px rgba(94,234,212,0.5))' }}></i>
          <h2 className="text-white fw-bold mb-4 tracking-widest uppercase">System Access</h2>
          {error && <div className="alert bg-danger bg-opacity-25 text-danger border border-danger mb-4 rounded-3">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="input-master-wrapper mb-4">
              <input type="text" className="input-master" required value={username} onChange={e => setUsername(e.target.value)} />
              <label className={username ? 'active' : ''}>Admin ID</label>
              <div className="input-border-glow"></div>
            </div>
            <div className="input-master-wrapper mb-4">
              <input type="password" className="input-master" required value={password} onChange={e => setPassword(e.target.value)} />
              <label className={password ? 'active' : ''}>Passcode</label>
              <div className="input-border-glow"></div>
            </div>
            <button type="submit" className="btn-masterpiece-primary w-100 mt-2">
              <span className="btn-bg-slide"></span>
              <span className="btn-content" style={{justifyContent: 'center'}}><i className="fas fa-lock-open me-2"></i> Authenticate</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-4 mb-3" style={{width: '60px', height:'60px', fontSize: '1.5rem', border: '1px solid rgba(94,234,212,0.3)'}}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <h5 className="text-white fw-bold mb-0">Admin <span className="text-primary">Center</span></h5>
          <span className="badge bg-success bg-opacity-25 text-success mt-2 rounded-pill"><span className="status-pulse me-1 d-inline-block"></span> Secure Connection</span>
        </div>

        <nav className="admin-nav">
          <div className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => {setActiveTab('dashboard'); setIsProjectFormOpen(false);}}>
            <i className="fas fa-chart-pie" style={{width: '20px'}}></i> Dashboard
          </div>
          <div className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => {setActiveTab('projects'); setIsProjectFormOpen(false);}}>
            <i className="fas fa-layer-group" style={{width: '20px'}}></i> Portfolio DB
          </div>
          <div className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => {setActiveTab('messages'); setIsProjectFormOpen(false);}}>
            <i className="fas fa-envelope-open-text" style={{width: '20px'}}></i> Comm Logs
            {messages.length > 0 && <span className="badge bg-danger ms-auto rounded-pill">{messages.length}</span>}
          </div>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <i className="fas fa-power-off"></i> Terminate Session
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        
        {/* 1. Dashboard Overview */}
        {activeTab === 'dashboard' && !isProjectFormOpen && (
          <div className="reveal-up">
            <h3 className="fw-bold text-white mb-4">Overview Metrics</h3>
            <div className="dashboard-widget-grid">
              <div className="admin-widget">
                <div className="widget-icon-box widget-icon-primary"><i className="fas fa-project-diagram"></i></div>
                <div className="widget-info">
                  <h5>Total Projects</h5>
                  <h2>{projects.length}</h2>
                </div>
              </div>
              <div className="admin-widget">
                <div className="widget-icon-box widget-icon-secondary"><i className="fas fa-inbox"></i></div>
                <div className="widget-info">
                  <h5>Unread Messages</h5>
                  <h2>{messages.length}</h2>
                </div>
              </div>
              <div className="admin-widget">
                <div className="widget-icon-box widget-icon-accent"><i className="fas fa-server"></i></div>
                <div className="widget-info">
                  <h5>System Status</h5>
                  <h2 className="fs-3 mt-1 text-success">Optimal</h2>
                </div>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header">
                <h5 className="text-white fw-bold mb-0">Recent Activity</h5>
              </div>
              <div className="text-center py-5 opacity-50">
                <i className="fas fa-wave-square fa-3x mb-3 text-secondary"></i>
                <p className="text-light">All systems functioning within normal parameters.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Projects Database */}
        {activeTab === 'projects' && !isProjectFormOpen && (
          <div className="reveal-up">
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h4 className="text-white fw-bold mb-0">Active Projects DB</h4>
                <button className="btn-masterpiece-primary btn-sm py-2 px-3" onClick={openAddProject}>
                  <span className="btn-bg-slide"></span>
                  <span className="btn-content"><i className="fas fa-plus me-2"></i> Deploy New</span>
                </button>
              </div>
              
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Technologies</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="project-title-cell">
                            <img src={`/${p.image_url}`} alt="" className="project-thumb" onError={(e) => { e.target.src = '/project_ai.png' }} />
                            {p.title}
                          </div>
                        </td>
                        <td><span className="badge bg-secondary bg-opacity-25 text-light border border-secondary fw-normal px-2 py-1">{p.technologies}</span></td>
                        <td className="text-end">
                          <button onClick={() => openEditProject(p)} className="action-btn edit" title="Edit">
                            <i className="fas fa-pen"></i>
                          </button>
                          <button onClick={() => handleDeleteProject(p.id)} className="action-btn delete" title="Delete">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {projects.length === 0 && <div className="text-center text-muted py-5">No projects found in database.</div>}
              </div>
            </div>
          </div>
        )}

        {/* Project Form (Add/Edit) */}
        {isProjectFormOpen && (
          <div className="reveal-up">
            <div className="admin-panel max-w-4xl mx-auto">
              <div className="admin-panel-header">
                <h4 className="text-primary fw-bold mb-0">
                  <i className={`fas ${editingId ? 'fa-pen' : 'fa-rocket'} me-2`}></i> 
                  {editingId ? 'Edit Project Schema' : 'Deploy New Project'}
                </h4>
                <button className="btn-close btn-close-white" onClick={() => setIsProjectFormOpen(false)}></button>
              </div>
              
              <form onSubmit={handleSaveProject} className="master-form">
                <div className="form-group-row mb-4">
                  <div className="input-master-wrapper">
                    <input type="text" className="input-master" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                    <label className={projectForm.title ? 'active' : ''}>Project Title</label>
                    <div className="input-border-glow"></div>
                  </div>
                  
                  {/* File Upload Field */}
                  <div className="input-master-wrapper d-flex align-items-center p-2">
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="rounded-3 me-3" style={{width: '50px', height: '50px', objectFit: 'cover'}} />
                    )}
                    <div className="flex-grow-1 position-relative">
                      <input type="file" className="form-control bg-transparent text-light border-0 w-100" accept="image/*" onChange={handleImageChange} style={{opacity: 0.8}} />
                      <div className="text-muted small px-2">Select Image from Device</div>
                    </div>
                    <div className="input-border-glow"></div>
                  </div>
                </div>

                <div className="input-master-wrapper mb-4">
                  <input type="text" className="input-master" required value={projectForm.technologies} onChange={e => setProjectForm({...projectForm, technologies: e.target.value})} />
                  <label className={projectForm.technologies ? 'active' : ''}>Technologies (comma separated)</label>
                  <div className="input-border-glow"></div>
                </div>

                <div className="input-master-wrapper mb-4">
                  <input type="text" className="input-master" required value={projectForm.link} onChange={e => setProjectForm({...projectForm, link: e.target.value})} />
                  <label className={projectForm.link ? 'active' : ''}>Project Link / Repo URL</label>
                  <div className="input-border-glow"></div>
                </div>

                <div className="input-master-wrapper mb-4">
                  <textarea className="input-master textarea-master" rows="2" required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})}></textarea>
                  <label className={projectForm.description ? 'active' : ''}>Short Description (Grid View)</label>
                  <div className="input-border-glow"></div>
                </div>

                <div className="input-master-wrapper mb-4">
                  <textarea className="input-master textarea-master" rows="5" required value={projectForm.long_description} onChange={e => setProjectForm({...projectForm, long_description: e.target.value})}></textarea>
                  <label className={projectForm.long_description ? 'active' : ''}>Long Description (Modal View)</label>
                  <div className="input-border-glow"></div>
                </div>

                <div className="d-flex justify-content-end gap-3 mt-5">
                  <button type="button" className="btn-masterpiece-outline" onClick={() => setIsProjectFormOpen(false)}>
                    <span className="btn-content">Cancel</span>
                  </button>
                  <button type="submit" className="btn-masterpiece-primary px-5">
                    <span className="btn-bg-slide"></span>
                    <span className="btn-content"><i className="fas fa-save me-2"></i> {editingId ? 'Save Changes' : 'Execute Deployment'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. Messages Log */}
        {activeTab === 'messages' && !isProjectFormOpen && (
          <div className="reveal-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-white mb-0">Comm Logs</h3>
            </div>
            
            <div className="row g-4">
              {messages.length === 0 ? (
                <div className="col-12 text-center py-5 admin-panel">
                  <i className="fas fa-satellite text-muted fa-3x mb-3 opacity-50"></i>
                  <p className="text-muted">No intercepted transmissions found.</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="col-lg-6">
                    <div className="msg-card">
                      <button onClick={() => handleDeleteMessage(msg.id)} className="action-btn delete position-absolute top-0 end-0 m-3" title="Delete">
                        <i className="fas fa-times"></i>
                      </button>
                      <div className="msg-header">
                        <div className="msg-avatar"><i className="fas fa-user"></i></div>
                        <div>
                          <h5 className="msg-name">{msg.name}</h5>
                          <a href={`mailto:${msg.email}`} className="msg-email text-decoration-none">{msg.email}</a>
                        </div>
                      </div>
                      <div className="msg-body">
                        "{msg.message}"
                      </div>
                      <div className="msg-footer">
                        <span><i className="far fa-clock me-1"></i> {new Date(msg.timestamp || msg.created_at).toLocaleString()}</span>
                        <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary">Decrypted</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Admin;
