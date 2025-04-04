import { useTranslation } from "react-i18next";
import { Info, Plus, Mic } from "lucide-react";

interface WelcomeBannerProps {
  userName: string;
}

const WelcomeBanner = ({ userName }: WelcomeBannerProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-accent-light py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-dark">
              {t('welcome.message', { name: userName })}
            </h2>
            <p className="text-neutral-dark flex items-center">
              {t('welcome.market.insight')}
              <a 
                href="/forecasts" 
                className="ml-2 text-primary font-medium flex items-center hover:underline"
              >
                <Info className="h-3 w-3 mr-1" />
                Learn More
              </a>
            </p>
          </div>
          <div className="flex space-x-3">
            <a href="/create-listing">
              <button className="bg-primary text-white py-2 px-4 rounded-md font-semibold flex items-center hover:bg-primary-dark transition duration-300">
                <Plus className="h-4 w-4 mr-2" />
                {t('welcome.add.listing')}
              </button>
            </a>
            <button 
              onClick={() => alert('Voice input feature will be available soon!')}
              className="bg-white border border-primary text-primary py-2 px-4 rounded-md font-semibold flex items-center hover:bg-primary-light hover:bg-opacity-10 transition duration-300"
            >
              <Mic className="h-4 w-4 mr-2" />
              {t('welcome.voice.input')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
