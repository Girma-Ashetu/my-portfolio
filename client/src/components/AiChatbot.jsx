import React, { useState, useRef, useEffect, useCallback } from 'react';
import './chatbot.css';

// ─── Markdown Renderer ────────────────────────────────────────────────────────
function MarkdownText({ content }) {
  const renderInline = (text) => {
    const parts = []; const pattern = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
    let lastIdx = 0; let key = 0; let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIdx) parts.push(<span key={key++}>{text.slice(lastIdx, match.index)}</span>);
      if (match[2]) parts.push(<strong key={key++}><em>{match[2]}</em></strong>);
      else if (match[3]) parts.push(<strong key={key++} className="md-bold">{match[3]}</strong>);
      else if (match[4]) parts.push(<em key={key++}>{match[4]}</em>);
      else if (match[5]) parts.push(<code key={key++} className="md-code">{match[5]}</code>);
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < text.length) parts.push(<span key={key++}>{text.slice(lastIdx)}</span>);
    return parts.length > 0 ? parts : text;
  };
  const renderLine = (line, idx) => {
    if (line.startsWith('### ')) return <h4 key={idx} className="md-h4">{line.slice(4)}</h4>;
    if (line.startsWith('## '))  return <h3 key={idx} className="md-h3">{line.slice(3)}</h3>;
    if (line.startsWith('# '))   return <h2 key={idx} className="md-h2">{line.slice(2)}</h2>;
    if (line.startsWith('- ') || line.startsWith('• ')) return <li key={idx} className="md-li">{renderInline(line.slice(2))}</li>;
    if (/^\d+\.\s/.test(line)) return <li key={idx} className="md-li">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>;
    if (line === '---') return <hr key={idx} className="md-hr" />;
    if (!line.trim()) return <br key={idx} />;
    return <p key={idx} className="md-p">{renderInline(line)}</p>;
  };
  const blocks = []; const lines = content.split('\n'); let i = 0; let listBuffer = [];
  const flushList = () => { if (listBuffer.length > 0) { blocks.push(<ul key={`ul-${i}`} className="md-ul">{listBuffer}</ul>); listBuffer = []; } };
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      flushList(); const lang = line.slice(3).trim(); i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
      blocks.push(<pre key={`code-${i}`} className="md-pre">{lang && <div className="md-pre-lang">{lang}</div>}<code className="md-pre-code">{codeLines.join('\n')}</code></pre>);
      i++; continue;
    }
    if (line.startsWith('- ') || line.startsWith('• ') || /^\d+\.\s/.test(line)) { listBuffer.push(renderLine(line, `li-${i}`)); i++; continue; }
    flushList(); blocks.push(renderLine(line, i)); i++;
  }
  flushList();
  return <div className="markdown-body">{blocks}</div>;
}

// ─── Smart Suggestions ────────────────────────────────────────────────────────
function getSmartSuggestions(userMsg, aiMsg) {
  const m = (userMsg || '').toLowerCase(); const a = (aiMsg || '').toLowerCase();
  if (m.includes('skill') || a.includes('react') || a.includes('node')) return ['What backend stack does he use?','How good is he at React?','What mobile tech does he know?'];
  if (m.includes('project') || a.includes('bank') || a.includes('portfolio')) return ['Which was the most complex project?','Does he have live demos?','What is his GitHub link?'];
  if (m.includes('hire') || a.includes('intern') || a.includes('job')) return ['What roles is he open to?','What is his availability?','How do I schedule a call?'];
  if (m.includes('cert') || a.includes('aws') || a.includes('azure')) return ['Which cert will he finish first?','Tell me about his AWS skills','Is he studying for CCNA?'];
  if (m.includes('contact') || a.includes('email') || a.includes('telegram')) return ['What is his phone number?','What timezone is he in?','What is his GitHub?'];
  return ['What are his strongest skills?','Tell me about his best project','Is he open to remote work?'];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'career',  label: '💼 Career',  actions: [
    { label: 'Hire Girma',        msg: 'Is Girma available for hire or internships right now?' },
    { label: 'Remote Work?',      msg: 'Is Girma open to remote work or freelancing?' },
    { label: 'Salary Expectation',msg: 'What are Girma\'s salary expectations for a junior role?' },
  ]},
  { id: 'skills',  label: '⚡ Skills',  actions: [
    { label: 'Full Tech Stack',   msg: 'What is Girma\'s complete technical skill set?' },
    { label: 'Strongest Skill',   msg: 'What is Girma\'s single strongest technical skill?' },
    { label: 'Mobile Dev',        msg: 'Tell me about Girma\'s mobile app development experience' },
  ]},
  { id: 'projects',label: '📂 Projects',actions: [
    { label: 'All Projects',      msg: 'List all of Girma\'s projects in detail' },
    { label: 'Best Project',      msg: 'What is Girma\'s most impressive project and why?' },
    { label: 'GitHub Link',       msg: 'What is the link to Girma\'s GitHub profile?' },
  ]},
  { id: 'about',   label: '👤 About',   actions: [
    { label: 'Background',        msg: 'Tell me about Girma\'s academic background and education' },
    { label: 'Certifications',    msg: 'What certifications is Girma currently pursuing?' },
    { label: 'Contact Info',      msg: 'How can I reach Girma directly? Email, phone, Telegram?' },
  ]},
];

const makeWelcome = () => ({
  id: 'welcome', role: 'assistant',
  content: "👋 Hi! I'm **GAIA** — Girma's **Advanced Intelligent Assistant**, powered by **Google Gemini AI**.\n\nI have deep, expert-level knowledge about Girma — his skills, projects, education, certifications, and career goals. I can also answer **any software engineering, programming, or career question** you have!\n\n🌟 Browse the **category tabs** below or just type your question.",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestions: [],
});

class ChatbotErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="chatbot-error-fallback"><p>⚠️ GAIA error</p><button onClick={() => this.setState({ hasError: false })}>Retry</button></div>;
    return this.props.children;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AiChatbotInner() {
  const [isOpen,      setIsOpen]      = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages,    setMessages]    = useState(() => {
    try { const s = localStorage.getItem('gaia_v5'); const p = s ? JSON.parse(s) : null; if (Array.isArray(p) && p.length > 0) return p; } catch (_) {}
    return [makeWelcome()];
  });
  const [input,       setInput]       = useState('');
  const [isTyping,    setIsTyping]    = useState(false);
  const [hasUnread,   setHasUnread]   = useState(false);
  const [copied,      setCopied]      = useState(null);
  const [reactions,   setReactions]   = useState({});
  const [activeTab,   setActiveTab]   = useState('career');
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch,  setShowSearch]  = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const abortRef       = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => { try { localStorage.setItem('gaia_v5', JSON.stringify(messages)); } catch (_) {} }, [messages]);
  useEffect(() => { if (isOpen && !isMinimized) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping, isOpen, isMinimized]);
  useEffect(() => { if (isOpen && !isMinimized) { setTimeout(() => inputRef.current?.focus(), 200); setHasUnread(false); } }, [isOpen, isMinimized]);
  useEffect(() => { if (inputRef.current) { inputRef.current.style.height = 'auto'; inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`; } }, [input]);

  // Voice input
  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice input not supported in this browser.'); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = true;
    rec.onresult = (e) => { const t = Array.from(e.results).map(r => r[0].transcript).join(''); setInput(t); };
    rec.onend = () => setIsListening(false);
    rec.start(); recognitionRef.current = rec; setIsListening(true);
  };

  // Export chat
  const exportChat = () => {
    const text = messages.map(m => `[${m.time}] ${m.role === 'user' ? 'You' : 'GAIA'}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'GAIA_Chat.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const sendMessage = useCallback(async (text) => {
    const userText = (text ?? input).trim();
    if (!userText || isTyping) return;
    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: userText, time: now() };
    const aiMsgId = `a-${Date.now() + 1}`;
    setMessages(prev => [...prev, userMsg, { id: aiMsgId, role: 'assistant', content: '', time: now(), isStreaming: true, suggestions: [] }]);
    setInput(''); setIsTyping(true);
    if (inputRef.current) inputRef.current.style.height = 'auto';
    const history = messages.filter(m => m.id !== 'welcome' && m.content).map(m => ({ role: m.role, content: m.content }));
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    try {
      const response = await fetch('/api/chat/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userText, history }), signal: abortRef.current.signal });
      if (!response.ok) throw new Error(`${response.status}`);
      const reader = response.body.getReader(); const decoder = new TextDecoder('utf-8');
      let buffer = ''; let fullContent = '';
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n'); buffer = events.pop();
        for (const event of events) {
          const line = event.split('\n').find(l => l.startsWith('data: ')); if (!line) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) { fullContent += data.chunk; setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: m.content + data.chunk } : m)); }
            if (data.done) { const suggestions = getSmartSuggestions(userText, fullContent); setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false, suggestions } : m)); }
          } catch (_) {}
        }
      }
      setMessages(prev => prev.map(m => { if (m.id !== aiMsgId) return m; const s = m.suggestions?.length > 0 ? m.suggestions : getSmartSuggestions(userText, m.content); return { ...m, isStreaming: false, suggestions: s }; }));
      if (!isOpen || isMinimized) setHasUnread(true);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setMessages(prev => { const f = prev.filter(m => m.id !== aiMsgId); return [...f, { id: `err-${Date.now()}`, role: 'assistant', content: '⚠️ **Connection error.** Make sure the server is running and try again.', time: now(), isError: true, suggestions: [] }]; });
    } finally { setIsTyping(false); abortRef.current = null; }
  }, [input, isTyping, messages, isOpen, isMinimized]);

  const clearChat = () => { if (window.confirm('Clear chat history?')) { setMessages([makeWelcome()]); setInput(''); localStorage.removeItem('gaia_v5'); } };
  const copyMsg = (id, text) => { navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2500); }); };
  const addReaction = (id, e) => setReactions(prev => ({ ...prev, [id]: prev[id] === e ? null : e }));

  const displayedMessages = searchQuery
    ? messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const showQuickActions = messages.filter(m => m.id !== 'welcome').length === 0;

  return (
    <>
      {/* FAB */}
      <button className={`gaia-fab${isOpen && !isMinimized ? ' gaia-fab--hidden' : ''}`} onClick={() => { setIsOpen(true); setIsMinimized(false); }} aria-label="Open GAIA" id="chatbot-fab-btn">
        {hasUnread && <span className="gaia-unread-badge">!</span>}
        <div className="gaia-fab-ring"></div>
        <span className="gaia-fab-icon"><i className="fas fa-robot" /></span>
        <span className="gaia-fab-label">GAIA AI</span>
      </button>

      {/* Panel */}
      <div className={`gaia-panel${isOpen ? ' gaia-panel--open' : ''}${isMinimized ? ' gaia-panel--minimized' : ''}`} id="chatbot-panel">
        {/* Header */}
        <div className="gaia-header">
          <div className="gaia-header-avatar">
            <div className="gaia-avatar-ring"></div>
            <i className="fas fa-robot" />
            <span className="gaia-online-dot"></span>
          </div>
          <div className="gaia-header-info">
            <h6 className="gaia-header-name">GAIA <span className="gaia-badge-ai">AI</span></h6>
            <p className="gaia-header-status"><span className="status-pulse"></span> Online · Gemini Powered</p>
          </div>
          <div className="gaia-header-actions">
            <button className="gaia-ctrl-btn" onClick={() => setShowSearch(v => !v)} title="Search chat"><i className="fas fa-search" /></button>
            <button className="gaia-ctrl-btn" onClick={exportChat}              title="Export chat"><i className="fas fa-download" /></button>
            <button className="gaia-ctrl-btn" onClick={clearChat}               title="Clear chat"><i className="fas fa-trash-alt" /></button>
            <button className="gaia-ctrl-btn" onClick={() => setIsMinimized(v => !v)} title="Minimize"><i className={`fas ${isMinimized ? 'fa-chevron-up' : 'fa-minus'}`} /></button>
            <button className="gaia-ctrl-btn gaia-ctrl-close" onClick={() => { setIsOpen(false); setIsMinimized(false); }} title="Close"><i className="fas fa-times" /></button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Search Bar */}
            {showSearch && (
              <div className="gaia-search-bar">
                <i className="fas fa-search gaia-search-icon" />
                <input className="gaia-search-input" placeholder="Search messages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus />
                {searchQuery && <button className="gaia-search-clear" onClick={() => setSearchQuery('')}><i className="fas fa-times" /></button>}
              </div>
            )}

            {/* Messages */}
            <div className="gaia-messages" id="chatbot-messages-area">
              {displayedMessages.map(msg => (
                <div key={msg.id} className={`gaia-row gaia-row--${msg.role}`}>
                  {msg.role === 'assistant' && <div className="gaia-avatar-sm"><i className="fas fa-robot" /></div>}
                  <div className={`gaia-bubble gaia-bubble--${msg.role}${msg.isError ? ' gaia-bubble--error' : ''}`}>
                    {msg.role === 'assistant' ? <MarkdownText content={msg.content || (msg.isStreaming ? '▋' : '')} /> : <p className="gaia-user-text">{msg.content}</p>}
                    <div className="gaia-bubble-footer">
                      <span className="gaia-time">{msg.time}</span>
                      <div className="gaia-bubble-actions">
                        {msg.role === 'assistant' && !msg.isStreaming && (
                          <>
                            <button className="gaia-action-btn" onClick={() => addReaction(msg.id, '👍')} data-active={reactions[msg.id] === '👍'} title="Helpful">👍</button>
                            <button className="gaia-action-btn" onClick={() => addReaction(msg.id, '👎')} data-active={reactions[msg.id] === '👎'} title="Not helpful">👎</button>
                            <button className="gaia-action-btn" onClick={() => copyMsg(msg.id, msg.content)} title="Copy">
                              {copied === msg.id ? <i className="fas fa-check" style={{color:'#4ade80'}} /> : <i className="far fa-copy" />}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {/* AI Suggestions */}
                    {msg.role === 'assistant' && !msg.isStreaming && msg.suggestions?.length > 0 && msg.id === messages[messages.length - 1]?.id && (
                      <div className="gaia-suggestions">
                        {msg.suggestions.map((s, si) => <button key={si} className="gaia-suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>)}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && <div className="gaia-avatar-sm gaia-avatar-sm--user"><i className="fas fa-user" /></div>}
                </div>
              ))}
              {isTyping && !messages.find(m => m.isStreaming) && (
                <div className="gaia-row gaia-row--assistant">
                  <div className="gaia-avatar-sm"><i className="fas fa-robot" /></div>
                  <div className="gaia-bubble gaia-bubble--assistant gaia-bubble--typing">
                    <span className="gaia-dot" /><span className="gaia-dot" /><span className="gaia-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Category Quick Actions */}
            {showQuickActions && (
              <div className="gaia-quick-wrap">
                <div className="gaia-category-tabs">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} className={`gaia-cat-tab ${activeTab === cat.id ? 'active' : ''}`} onClick={() => setActiveTab(cat.id)}>
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div className="gaia-action-list">
                  {CATEGORIES.find(c => c.id === activeTab)?.actions.map((a, i) => (
                    <button key={i} className="gaia-action-item" onClick={() => sendMessage(a.msg)}>
                      <i className="fas fa-chevron-right gaia-action-arrow" /> {a.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="gaia-input-area">
              <button className={`gaia-voice-btn${isListening ? ' gaia-voice-btn--active' : ''}`} onClick={toggleVoice} title="Voice input">
                <i className={`fas ${isListening ? 'fa-stop-circle' : 'fa-microphone'}`} />
              </button>
              <div className="gaia-input-wrapper">
                <textarea ref={inputRef} className="gaia-input" placeholder="Ask me anything..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} rows={1} disabled={isTyping} id="chatbot-input-field" maxLength={1000} />
              </div>
              <button className={`gaia-send-btn${input.trim() && !isTyping ? ' gaia-send-btn--active' : ''}`} onClick={() => sendMessage()} disabled={!input.trim() || isTyping} id="chatbot-send-btn">
                {isTyping ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-paper-plane" />}
              </button>
            </div>
            <p className="gaia-footer-note"><i className="fas fa-shield-alt me-1" /> GAIA · Gemini AI · Shift+Enter for new line · <button className="gaia-export-inline" onClick={exportChat}>Export Chat</button></p>
          </>
        )}
      </div>
    </>
  );
}

export default function AiChatbot() {
  return <ChatbotErrorBoundary><AiChatbotInner /></ChatbotErrorBoundary>;
}
