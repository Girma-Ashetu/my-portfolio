import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI Assistant State
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const typingSpeed = 15; // ms per char - extremely fast response

  const [showAdviceBox, setShowAdviceBox] = useState(false);
  const [adviceTopic, setAdviceTopic] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Transmitting to server...');
    
    // Save info before clearing form
    const userName = formData.name;
    const msgLength = formData.message.length;
    
    try {
      await axios.post('/api/messages', formData);
      setStatus('');
      setFormData({ name: '', email: '', message: '' });
      
      // Trigger AI Response Sequence with smart content analysis
      triggerAiAssistant(userName, msgLength, formData.message);
    } catch (err) {
      console.error(err);
      setStatus('Failed to send. Communication jammed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetAdvice = () => {
    if (!showAdviceBox) {
      setShowAdviceBox(true);
      return;
    }
    if (!adviceTopic.trim()) return;

    triggerAiAssistant(formData.name || "Guest", adviceTopic.length, adviceTopic);
  };

  const triggerAiAssistant = (name, length, messageText) => {
    setAiResponse(true);
    setIsAiTyping(true);
    setTypedText('');
    
    const firstName = name.split(' ')[0];
    const msg = (messageText || '').toLowerCase();
    
    let adviceEn = "";
    let adviceAm = "";
    let adviceOm = "";

    if (msg.includes('hire') || msg.includes('job') || msg.includes('work') || msg.includes('opportunity') || msg.includes('intern')) {
      adviceEn = "\n\n💡 AI Advice: I notice you are discussing a professional opportunity. Girma is currently open for internships and junior software engineering roles. He is particularly interested in full-stack and cloud-based positions.";
      adviceAm = "\n\n💡 ኤአይ (AI) ምክር፡ ስለ ስራ እድል እንዳነሱ ተረድቻለሁ። ግርማ በአሁኑ ሰዓት ለስራ ልምምድ (internship) እና ለጀማሪ የሶፍትዌር ምህንድስና ስራዎች ክፍት ነው።";
      adviceOm = "\n\n💡 Gorsa AI: Waa'ee carraa hojii akka dubbatte nan hubadha. Girmaan yeroo ammaa carraa hojii internships fi hojii sooftiweerii jalqabaa hojjechuuf banaa dha.";
    } else if (msg.includes('advice') || msg.includes('learn') || msg.includes('help') || msg.includes('student') || msg.includes('guide')) {
      adviceEn = "\n\n💡 AI Advice: Are you looking for technical advice or learning resources? Girma highly recommends mastering Data Structures and building real-world projects consistently to grow as a developer.";
      adviceAm = "\n\n💡 ኤአይ (AI) ምክር፡ የቴክኒክ ምክር ወይም የመማሪያ ግብዓቶችን እየፈለጉ ነው? ግርማ ቋሚ የሆነ ዳታ ስትራክቸር መለማመድ እና እውነተኛ ፕሮጀክቶችን መስራት እንደሚጠቅም ይመክራል።";
      adviceOm = "\n\n💡 Gorsa AI: Gorsa teeknikaa yookiin madda barumsaa barbaadaa jirtaa? Girmaan dandeettii Data Structures akka sirriitti barattuu fi pirojektoota dhugaa akka hojjettu si gorsa.";
    } else if (msg.includes('collab') || msg.includes('project') || msg.includes('idea') || msg.includes('startup')) {
      adviceEn = "\n\n💡 AI Advice: It looks like you want to collaborate! Girma loves contributing to open-source and working on innovative projects. Please leave a link to your repository or details when he reaches out.";
      adviceAm = "\n\n💡 ኤአይ (AI) ምክር፡ አብሮ ለመስራት ያሰቡ ይመስላል! ግርማ በክፍት-ምንጭ ፕሮጀክቶች ላይ መስራት ይወዳል። ካለዎት የሬፖዚቶሪ ሊንክዎን ይተውልን።";
      adviceOm = "\n\n💡 Gorsa AI: Akka waliin hojjechuu barbaaddu natti fakkaata! Girmaan pirojektoota haaromfaman irratti hojjechuu baay'ee jaallata. Yoo qabaatte liinkii pirojektii keetii naaf dhiisi.";
    } else {
      adviceEn = "\n\n💡 AI Advice: Did you know? Consistently writing clean code and documenting your projects is the key to software engineering success.";
      adviceAm = "\n\n💡 ኤአይ (AI) ምክር፡ ያውቃሉ? ሁሌም ንፁህ ኮድ መፃፍ እና ፕሮጀክቶችን በደንብ ማሰነድ ለሶፍትዌር ምህንድስና ስኬት ቁልፍ ነው።";
      adviceOm = "\n\n💡 Gorsa AI: Beektuu? Yeroo mara koodii qulqulluu barreessuu fi pirojektoota keessan sirriitti galmeessuun furtuu milkaa'ina injinariingii sooftiweeriiti.";
    }
    
    let aiMessage = '';
    if (language === 'am') {
      aiMessage = `ሰላም ${firstName}፣ እኔ የግርማ ኤአይ (AI) ረዳት ነኝ። መልእክትዎን በተሳካ ሁኔታ ተቀብያለሁ። የእርስዎ መልዕክት (${length} ፊደላት) በሚስጥር ተጠብቆ በመረጃ ቋት ውስጥ ተቀምጧል። ግርማ አሁን ኦንላይን ላይ አይደለም ነገር ግን መልዕክትዎን ቅድሚያ ሰጥቼዋለሁ። በቅርቡ ይመልስልዎታል። ስለተገናኙን እናመሰግናለን።` + adviceAm;
    } else if (language === 'om') {
      aiMessage = `Akkam ${firstName}, Ani gargaaraa AI Girmaati. Ergaa kee haala gaariin fudhadheera. Ergaan kee (arfiilee ${length}) qindaayee kuusaa deetaa eegumsa qabu keessa taa'eera. Girmaan amma sarara irra hin jiru, garuu ergaa kee dursa kenneefira. Dhiyeenyatti siif deebisa. Quunnamtii keetiif galatoomi.` + adviceOm;
    } else {
      aiMessage = `Hello ${firstName}, I am Girma's automated AI assistant. I have successfully received your transmission. ` +
        `Your message (${length} characters) has been encrypted and stored in the secure database. ` +
        `Girma is currently offline, but I have flagged this as priority. He will review your request and get back to you shortly. Thank you for connecting.` + adviceEn;
    }
    
    let i = 0;
    const intervalId = setInterval(() => {
      setTypedText(aiMessage.substring(0, i));
      i++;
      if (i > aiMessage.length) {
        clearInterval(intervalId);
        setIsAiTyping(false);
      }
    }, typingSpeed);
  };

    const resetForm = () => {
    setAiResponse(null);
    setTypedText('');
    setShowAdviceBox(false);
    setAdviceTopic('');
  };

  const contactItems = [
    { icon: 'fa-envelope', label: 'Email', value: 'girme405@gmail.com', href: 'mailto:girme405@gmail.com', color: 'primary' },
    { icon: 'fab fa-github', label: 'GitHub', value: 'github.com/Girma-Ashetu', href: 'https://github.com/Girma-Ashetu', color: 'secondary' },
    { icon: 'fab fa-linkedin-in', label: 'LinkedIn', value: 'linkedin.com/in/girmaasefa', href: 'https://linkedin.com/', color: 'info' },
    { icon: 'fab fa-telegram-plane', label: 'Telegram', value: '@Progirma35', href: 'https://t.me/Progirma35', color: 'primary' },
    { icon: 'fa-phone', label: 'Phone', value: '+251 915 387 500', href: 'tel:+251915387500', color: 'accent' },
    { icon: 'fa-map-marker-alt', label: 'Location', value: 'Jimma, Ethiopia', href: null, color: 'secondary' },
  ];

  return (
    <section className="py-10 mt-5 pt-5 min-vh-100">
      <div className="container py-5">
        <div className="text-center mb-5 reveal-up">
          <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>{t('contact', 'title')}</h6>
          <h2 className="display-4 fw-bold mb-3"><span className="text-gradient">{t('contact', 'connect')}</span></h2>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px', lineHeight: '1.8' }}>
            {t('contact', 'desc')}
          </p>
        </div>

        <div className="row g-5">
          {/* Contact Info */}
          <div className="col-lg-5 reveal-up">
            <div className="glass-pane p-5 h-100 bento-item">
              <h4 className="text-white fw-bold mb-5">{t('contact', 'info')}</h4>
              <div className="d-flex flex-column gap-4">
                {contactItems.map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-4 group">
                    <div className={`glass-pane p-3 rounded-3 text-${item.color} fs-5 flex-shrink-0 contact-info-icon`} style={{ width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`${item.icon.startsWith('fab') ? item.icon : `fas ${item.icon}`}`}></i>
                    </div>
                    <div>
                      <p className="text-muted small uppercase tracking-widest mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={`text-white fw-semibold text-decoration-none hover-glow`}>
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-white fw-semibold mb-0">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form / AI Assistant */}
          <div className="col-lg-7 reveal-up" style={{ transitionDelay: '0.2s' }}>
            <div className="glass-pane p-5 h-100 bento-item-large position-relative overflow-hidden">
              
              {!aiResponse ? (
                // Normal Contact Form
                <div className="form-container" style={{ animation: 'revealUp 0.5s ease-out' }}>
                  <h4 className="text-white fw-bold mb-5"><i className="fas fa-paper-plane text-primary me-2"></i> {t('contact', 'sendMsg')}</h4>
                  
                  {status && (
                    <div className={`alert ${status.includes('Failed') ? 'alert-danger border-danger text-danger bg-danger bg-opacity-10' : 'alert-info border-info text-info bg-info bg-opacity-10'} mb-4 rounded-3 border`}>
                      <i className={`fas ${status.includes('Failed') ? 'fa-exclamation-triangle' : 'fa-circle-notch fa-spin'} me-2`}></i> {status}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label text-white fw-bold small uppercase tracking-widest">{t('contact','name')}</label>
                        <input
                          type="text"
                          className="form-control premium-input py-3"
                          placeholder="e.g. John Doe"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-white fw-bold small uppercase tracking-widest">{t('contact','email')}</label>
                        <input
                          type="email"
                          className="form-control premium-input py-3"
                          placeholder="e.g. john@company.com"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-white fw-bold small uppercase tracking-widest">{t('contact','payload')}</label>
                        <textarea
                          className="form-control premium-input"
                          rows="5"
                          placeholder="..."
                          required
                          value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                      </div>
                      <div className="col-12 mt-4">
                        <div className="d-flex flex-column gap-3">
                          {showAdviceBox && (
                            <div className="reveal-up">
                              <label className="form-label text-accent fw-bold small uppercase tracking-widest">{t('contact', 'advicePrompt') || 'What do you need advice on?'}</label>
                              <textarea
                                className="form-control premium-input border-accent"
                                rows="3"
                                placeholder={t('contact', 'advicePlaceholder') || "e.g. 'How do I start a career in full-stack web development?'"}
                                value={adviceTopic}
                                onChange={e => setAdviceTopic(e.target.value)}
                              ></textarea>
                            </div>
                          )}
                          <div className="d-flex flex-column flex-sm-row gap-3 mt-2">
                            <button type="submit" className="btn-premium flex-grow-1 py-3 d-flex justify-content-center" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <><i className="fas fa-circle-notch fa-spin me-2"></i> {t('contact','transmit')}...</>
                              ) : (
                                <><i className="fas fa-satellite-dish me-2"></i> {t('contact','transmit')}</>
                              )}
                            </button>
                            <button type="button" onClick={handleGetAdvice} className="btn-outline-premium flex-grow-1 py-3 d-flex justify-content-center" style={showAdviceBox ? { borderColor: 'var(--accent-color)', color: 'var(--accent-color)' } : {}}>
                              <i className="fas fa-lightbulb me-2"></i> {showAdviceBox ? (t('contact', 'askAi') || 'Ask AI for Advice') : (t('contact','getAdvice') || 'Get AI Advice')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                // AI Auto-Responder Mode
                <div className="ai-assistant-container d-flex flex-column justify-content-center h-100 text-center px-3" style={{ animation: 'revealUp 0.6s ease-out' }}>
                  <div className="ai-orb mx-auto mb-4 position-relative">
                    <div className="bg-primary rounded-circle shadow-lg" style={{ width: '80px', height: '80px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, position: 'relative' }}>
                      <i className={`fas ${isAiTyping ? 'fa-cog fa-spin' : 'fa-robot'} text-white fa-2x`}></i>
                    </div>
                    {isAiTyping && (
                      <div className="position-absolute top-50 start-50 translate-middle rounded-circle border border-2 border-primary" style={{ width: '110px', height: '110px', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
                    )}
                  </div>
                  
                  <h3 className="fw-bold text-white mb-2">{t('contact','aiProtocol')}</h3>
                  <div className="badge bg-primary bg-opacity-25 text-primary border border-primary mx-auto mb-4 rounded-pill px-3 py-1">
                    <i className="fas fa-circle text-success me-2" style={{ fontSize: '8px' }}></i> Active
                  </div>
                  
                  <div className="ai-chat-box bg-dark bg-opacity-50 border border-secondary p-4 rounded-4 text-start position-relative">
                    <p className="text-light mb-0" style={{ lineHeight: '1.8', fontSize: '1.05rem', minHeight: '120px' }}>
                      {typedText}
                      {isAiTyping && <span className="cursor ms-1 text-primary fw-bold">|</span>}
                    </p>
                  </div>
                  
                  {!isAiTyping && (
                    <div className="mt-5 reveal-up">
                      <button onClick={resetForm} className="btn btn-outline-secondary rounded-pill px-4 py-2 text-light hover-glow">
                        <i className="fas fa-redo-alt me-2"></i> {t('contact','sendAnother')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
