import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './overhaul.css'
import './premium.css'
import './home.css'
import './pages/page_light_mode.css'
import './components/footer_light.css'
import './components/chatbot_light.css'
import './responsive_mobile.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
