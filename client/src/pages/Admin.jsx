import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddingProject, setIsAddingProject] = useState(false);
  
  const [newProject, setNewProject] = useState({
    title: '', description: '', technologies: '', link: '', image_url: ''
  });

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

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/projects', newProject, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewProject({ title: '', description: '', technologies: '', link: '', image_url: '' });
      setIsAddingProject(false);
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to add project');
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
      <section className="py-10 mt-5 pt-5 min-vh-100 d-flex align-items-center position-relative">
        <div className="container position-relative z-1">
          <div className="row justify-content-center">
            <div className="col-md-5 text-center reveal-up">
              <i className="fas fa-lock text-primary fa-3x mb-3" style={{ filter: 'drop-shadow(0 0 10px rgba(94,234,212,0.5))' }}></i>
              <h2 className="text-white fw-bold mb-4 tracking-widest uppercase" style={{ letterSpacing: '4px' }}>SYSTEM ACCESS</h2>
              <div className="glass-pane p-5">
                {error && <div className="alert bg-danger bg-opacity-25 text-danger border-danger border-opacity-50">{error}</div>}
                <form onSubmit={handleLogin}>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-transparent border-end-0 border-secondary text-primary"><i className="fas fa-user-shield"></i></span>
                    <input type="text" placeholder="Admin ID" className="form-control premium-input border-start-0 ps-0" required value={username} onChange={e => setUsername(e.target.value)} />
                  </div>
                  <div className="input-group mb-4">
                    <span className="input-group-text bg-transparent border-end-0 border-secondary text-primary"><i className="fas fa-key"></i></span>
                    <input type="password" placeholder="Passcode" className="form-control premium-input border-start-0 ps-0" required value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  <button type="submit" className="btn-premium w-100 d-flex justify-content-center">Authenticate</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 mt-5 pt-5 min-vh-100 position-relative">
      <div className="container position-relative z-1">
        
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 reveal-up bg-dark bg-opacity-50 p-4 rounded-4 border border-secondary glass-pane">
          <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
            <div className="bg-primary bg-opacity-25 p-3 rounded-circle border border-primary d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <i className="fas fa-satellite-dish text-primary fs-3"></i>
            </div>
            <div>
              <h3 className="fw-bold text-white mb-0">Admin <span className="text-primary">Command Center</span></h3>
              <p className="text-muted mb-0 small">System status: <span className="text-success"><i className="fas fa-circle ms-1 me-1" style={{ fontSize: '8px' }}></i> Online</span></p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-4">
            <i className="fas fa-power-off me-2"></i> Terminate Session
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="d-flex gap-3 mb-4 reveal-up overflow-auto pb-2">
          <button className={`btn rounded-pill px-4 ${activeTab === 'dashboard' ? 'btn-primary shadow-lg' : 'btn-outline-secondary text-light'}`} onClick={() => setActiveTab('dashboard')}><i className="fas fa-chart-line me-2"></i> Overview</button>
          <button className={`btn rounded-pill px-4 ${activeTab === 'projects' ? 'btn-primary shadow-lg' : 'btn-outline-secondary text-light'}`} onClick={() => { setActiveTab('projects'); setIsAddingProject(false); }}><i className="fas fa-project-diagram me-2"></i> Portfolio DB</button>
          <button className={`btn rounded-pill px-4 ${activeTab === 'messages' ? 'btn-primary shadow-lg' : 'btn-outline-secondary text-light'}`} onClick={() => setActiveTab('messages')}><i className="fas fa-envelope-open-text me-2"></i> Comm Logs</button>
        </div>

        {/* 1. Dashboard Overview Tab */}
        {activeTab === 'dashboard' && (
          <div className="row g-4 reveal-up">
            <div className="col-md-6">
              <div className="glass-pane p-4 h-100 d-flex align-items-center gap-4 bento-item">
                <div className="p-3 bg-primary bg-opacity-10 rounded-3 text-primary">
                  <i className="fas fa-layer-group fa-3x"></i>
                </div>
                <div>
                  <h5 className="text-muted mb-1 uppercase tracking-widest" style={{ fontSize: '0.8rem', letterSpacing: '2px' }}>Total Projects</h5>
                  <h1 className="fw-bold text-white mb-0 display-4">{projects.length}</h1>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="glass-pane p-4 h-100 d-flex align-items-center gap-4 bento-item">
                <div className="p-3 bg-accent bg-opacity-10 rounded-3 text-accent">
                  <i className="fas fa-inbox fa-3x"></i>
                </div>
                <div>
                  <h5 className="text-muted mb-1 uppercase tracking-widest" style={{ fontSize: '0.8rem', letterSpacing: '2px' }}>Unread Messages</h5>
                  <h1 className="fw-bold text-white mb-0 display-4">{messages.length}</h1>
                </div>
              </div>
            </div>
            <div className="col-12 mt-4">
              <div className="glass-pane p-5 text-center">
                <i className="fas fa-robot text-secondary fa-4x mb-4 opacity-50"></i>
                <h3 className="text-white">System Operations Normal</h3>
                <p className="text-muted">Database connectivity is stable. You can manage your portfolio or review incoming contact messages using the tabs above.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Projects Management Tab */}
        {activeTab === 'projects' && (
          <div className="reveal-up">
            {!isAddingProject ? (
              <div className="glass-pane p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                  <h4 className="text-white fw-bold mb-0">Active Projects Database</h4>
                  <button className="btn-premium py-2 px-3" onClick={() => setIsAddingProject(true)}>
                    <i className="fas fa-plus me-2"></i> Deploy Project
                  </button>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle mb-0">
                    <thead className="text-primary" style={{ borderBottom: '2px solid var(--primary)' }}>
                      <tr>
                        <th className="bg-transparent text-primary tracking-widest">PROJECT TITLE</th>
                        <th className="bg-transparent text-primary tracking-widest">TECHNOLOGIES</th>
                        <th className="bg-transparent text-primary tracking-widest text-end">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td className="bg-transparent text-white fw-bold py-3">
                            <div className="d-flex align-items-center gap-3">
                              <img src={`/${p.image_url}`} alt="" className="rounded-2" style={{ width: '40px', height: '40px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/project_ai.png' }} />
                              {p.title}
                            </div>
                          </td>
                          <td className="bg-transparent text-muted">{p.technologies}</td>
                          <td className="bg-transparent text-end">
                            <button onClick={() => handleDeleteProject(p.id)} className="btn btn-sm btn-outline-danger px-3 rounded-pill">
                              <i className="fas fa-trash-alt me-1"></i> Purge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {projects.length === 0 && <p className="text-center text-muted py-5">No projects deployed.</p>}
                </div>
              </div>
            ) : (
              <div className="glass-pane p-5 mx-auto" style={{ maxWidth: '800px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="text-primary fw-bold mb-0"><i className="fas fa-rocket me-2"></i> Deploy New Project</h4>
                  <button className="btn-close btn-close-white" onClick={() => setIsAddingProject(false)}></button>
                </div>
                
                <form onSubmit={handleAddProject}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-muted small mb-1">Project Title</label>
                      <input type="text" className="form-control premium-input" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small mb-1">Image URI</label>
                      <input type="text" className="form-control premium-input" placeholder="e.g. project_ai.png" required value={newProject.image_url} onChange={e => setNewProject({...newProject, image_url: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="text-muted small mb-1">Technologies (Comma separated)</label>
                      <input type="text" className="form-control premium-input" placeholder="React, Node, Express, MySQL" required value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="text-muted small mb-1">Project Link / Repo URL</label>
                      <input type="text" className="form-control premium-input" required value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="text-muted small mb-1">Description</label>
                      <textarea className="form-control premium-input" rows="4" required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}></textarea>
                    </div>
                  </div>
                  <div className="mt-4 d-flex justify-content-end gap-3">
                    <button type="button" className="btn btn-outline-secondary px-4 rounded-pill text-light" onClick={() => setIsAddingProject(false)}>Cancel</button>
                    <button type="submit" className="btn-premium px-5"><i className="fas fa-upload me-2"></i> Execute Deployment</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 3. Messages / Comm Logs Tab */}
        {activeTab === 'messages' && (
          <div className="reveal-up">
            <div className="glass-pane p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                <h4 className="text-white fw-bold mb-0">Intercepted Transmissions</h4>
                <span className="badge bg-primary bg-opacity-25 text-primary border border-primary fs-6 px-3 py-2 rounded-pill">
                  {messages.length} Total
                </span>
              </div>
              
              <div className="row g-4">
                {messages.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <i className="fas fa-box-open text-muted fa-3x mb-3 opacity-50"></i>
                    <p className="text-muted">No incoming transmissions found.</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="col-md-6">
                      <div className="p-4 border border-secondary rounded-4 bg-dark bg-opacity-25 position-relative h-100">
                        <button 
                          onClick={() => handleDeleteMessage(msg.id)} 
                          className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-3 rounded-circle"
                          style={{ width: '30px', height: '30px', padding: 0 }}
                          title="Delete Message"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <h5 className="text-white fw-bold mb-0">{msg.name}</h5>
                            <a href={`mailto:${msg.email}`} className="text-primary small text-decoration-none">{msg.email}</a>
                          </div>
                        </div>
                        <p className="text-light mb-3" style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>"{msg.message}"</p>
                        <div className="text-muted small text-end">
                          <i className="far fa-clock me-1"></i> {new Date(msg.timestamp || msg.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default Admin;
