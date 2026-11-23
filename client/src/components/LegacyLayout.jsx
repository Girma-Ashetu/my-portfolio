import { Outlet } from 'react-router-dom';
import './legacy.css';
import { LanguageProvider } from '../context/LanguageContext';
export default function LegacyLayout() { return <LanguageProvider><div className="legacy-content"><Outlet /></div></LanguageProvider>; }
