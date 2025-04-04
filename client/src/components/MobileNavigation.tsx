import { useTranslation } from "react-i18next";
import { useLocation, Link } from "wouter";
import { Home, Store, TrendingUp, User } from "lucide-react";

const MobileNavigation = () => {
  const { t } = useTranslation();
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-neutral-light z-10">
      <div className="flex justify-around">
        <Link to="/" className={`flex flex-col items-center py-2 px-4 ${location === '/' ? 'text-primary' : 'text-neutral-medium'}`}>
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">{t('mobile.home')}</span>
        </Link>
        <Link to="/marketplace" className={`flex flex-col items-center py-2 px-4 ${location === '/marketplace' ? 'text-primary' : 'text-neutral-medium'}`}>
          <Store className="h-5 w-5" />
          <span className="text-xs mt-1">{t('mobile.market')}</span>
        </Link>
        <Link to="/forecasts" className={`flex flex-col items-center py-2 px-4 ${location === '/forecasts' ? 'text-primary' : 'text-neutral-medium'}`}>
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs mt-1">{t('mobile.prices')}</span>
        </Link>
        <Link to="/account" className={`flex flex-col items-center py-2 px-4 ${location === '/account' ? 'text-primary' : 'text-neutral-medium'}`}>
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">{t('mobile.profile')}</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
