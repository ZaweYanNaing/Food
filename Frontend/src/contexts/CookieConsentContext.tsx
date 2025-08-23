import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface CookieConsentType {
  hasConsented: boolean;
  consentCookies: () => void;
  rejectCookies: () => void;
  showConsent: boolean;
}

const CookieConsentContext = createContext<CookieConsentType | undefined>(undefined);

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const [hasConsented, setHasConsented] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice about cookies
    const consentStatus = localStorage.getItem('cookieConsent');
    if (consentStatus === null) {
      // Show consent banner if no choice has been made
      setShowConsent(true);
    } else {
      setHasConsented(consentStatus === 'accepted');
    }
  }, []);

  const consentCookies = () => {
    setHasConsented(true);
    setShowConsent(false);
    localStorage.setItem('cookieConsent', 'accepted');
    
    // Here you could also set analytics cookies or other tracking
    // For example: gtag('consent', 'update', { analytics_storage: 'granted' });
  };

  const rejectCookies = () => {
    setHasConsented(false);
    setShowConsent(false);
    localStorage.setItem('cookieConsent', 'rejected');
    
    // Here you could also disable analytics cookies or other tracking
    // For example: gtag('consent', 'update', { analytics_storage: 'denied' });
  };

  const value: CookieConsentType = {
    hasConsented,
    consentCookies,
    rejectCookies,
    showConsent,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}
