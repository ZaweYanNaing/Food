import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from '../ui/CookieConsent';
import JoinUsModal from '../ui/JoinUsModal';
import { useState } from 'react';

export default function Layout() {
  const [showJoinUsModal, setShowJoinUsModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onJoinUsClick={() => setShowJoinUsModal(true)} />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
      
      <CookieConsent />
      <JoinUsModal 
        isOpen={showJoinUsModal} 
        onClose={() => setShowJoinUsModal(false)} 
      />
    </div>
  );
}
