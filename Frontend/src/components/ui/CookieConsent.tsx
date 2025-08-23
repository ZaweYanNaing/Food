import { useCookieConsent } from '../../contexts/CookieConsentContext';
import {Button} from './button';
import { Cookie, Shield, Info } from 'lucide-react';

export default function CookieConsent() {
  const { showConsent, consentCookies, rejectCookies } = useCookieConsent();

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            <Cookie className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              We use cookies to enhance your experience
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              We use cookies and similar technologies to help personalize content, 
              provide social media features, and analyze our traffic. We also share 
              information about your use of our site with our social media, advertising, 
              and analytics partners who may combine it with other information that 
              you've provided to them or that they've collected from your use of their services.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <a 
                href="/privacy-policy" 
                className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
              >
                <Shield className="w-3 h-3" />
                <span>Privacy Policy</span>
              </a>
              <a 
                href="/cookie-policy" 
                className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
              >
                <Info className="w-3 h-3" />
                <span>Cookie Policy</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={rejectCookies}
            className="whitespace-nowrap"
          >
            Reject All
          </Button>
          <Button
            size="sm"
            onClick={consentCookies}
            className="whitespace-nowrap"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
