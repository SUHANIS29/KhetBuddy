import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  changeLanguage: (lang: string) => void;
  currentLanguage: string;
}

const Header = ({ isLoggedIn, changeLanguage, currentLanguage }: HeaderProps) => {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    setLanguageDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Language display names
  const languages = {
    en: "English",
    hi: "हिन्दी (Hindi)",
    te: "తెలుగు (Telugu)",
    mr: "मराठी (Marathi)"
  };

  // Use Link component instead of this function for navigation
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80" 
            alt="AgriNet Logo" 
            className="h-10 w-10 mr-3 rounded-full"
          />
          <Link to="/" className="text-2xl font-bold cursor-pointer">{t('app.name')}</Link>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className={`hover:text-accent-light font-semibold ${location === '/' ? 'text-accent-light' : 'text-white'}`}
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/marketplace" 
                  className={`hover:text-accent-light font-semibold ${location === '/marketplace' ? 'text-accent-light' : 'text-white'}`}
                >
                  {t('nav.marketplace')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/forecasts" 
                  className={`hover:text-accent-light font-semibold ${location === '/forecasts' ? 'text-accent-light' : 'text-white'}`}
                >
                  {t('nav.forecasts')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/account" 
                  className={`hover:text-accent-light font-semibold ${location === '/account' ? 'text-accent-light' : 'text-white'}`}
                >
                  {t('nav.account')}
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Language Selector */}
          <div className="relative inline-block text-left">
            <button 
              onClick={toggleLanguageDropdown}
              className="flex items-center space-x-1 bg-primary-dark px-3 py-1 rounded-md"
            >
              <span className="text-white">{languages[currentLanguage as keyof typeof languages] || languages.en}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  {Object.entries(languages).map(([code, name]) => (
                    <button 
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className={`block w-full text-left px-4 py-2 text-neutral-dark hover:bg-neutral-lightest ${currentLanguage === code ? 'bg-primary bg-opacity-10' : ''}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="block md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-dark">
          <div className="container mx-auto px-4 py-3">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`block text-white hover:text-accent-light font-semibold py-2 ${location === '/' ? 'text-accent-light' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/marketplace" 
                  className={`block text-white hover:text-accent-light font-semibold py-2 ${location === '/marketplace' ? 'text-accent-light' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.marketplace')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/forecasts" 
                  className={`block text-white hover:text-accent-light font-semibold py-2 ${location === '/forecasts' ? 'text-accent-light' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.forecasts')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/account" 
                  className={`block text-white hover:text-accent-light font-semibold py-2 ${location === '/account' ? 'text-accent-light' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.account')}
                </Link>
              </li>
              <li className="pt-2 border-t border-primary">
                <span className="block text-white font-semibold py-2">Select Language</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.entries(languages).map(([code, name]) => (
                    <button 
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className={`px-3 py-1 rounded text-white text-sm ${currentLanguage === code ? 'bg-accent text-primary-dark' : 'bg-primary'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
