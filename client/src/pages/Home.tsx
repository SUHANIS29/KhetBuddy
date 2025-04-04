import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp, ShoppingBasket, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import WelcomeBanner from "../components/WelcomeBanner";
import DashboardCard from "../components/DashboardCard";
import AIPricePredictor from "../components/AIPricePredictor";
import MarketplaceBrowser from "../components/MarketplaceBrowser";
import CropDemandForecast from "../components/CropDemandForecast";
import SMSFeatureDemo from "../components/SMSFeatureDemo";
import CropBarterSystem from "../components/CropBarterSystem";
import { useQuery } from "@tanstack/react-query";

interface HomeProps {
  currentUser: {
    id: number;
    name: string;
    location: string;
    role: string;
  };
}

const Home = ({ currentUser }: HomeProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Fetch user listings
  const { data: userListings = [] } = useQuery<any[]>({
    queryKey: ['/api/users', currentUser.id, 'listings'],
    enabled: !!currentUser.id,
  });

  // Market price data
  const marketPrices = [
    { name: "Tomatoes", value: "₹25/kg", trend: "up" as const, highlight: true },
    { name: "Onions", value: "₹18/kg", trend: "up" as const, highlight: true },
    { name: "Potatoes", value: "₹12/kg", trend: "down" as const, highlight: false }
  ];
  
  // Prepare active listings data
  const activeListings = userListings.slice(0, 3).map((listing: any) => ({
    name: `${listing.cropType?.name || 'Crop'} (${listing.quantity}kg)`,
    value: listing.bidCount > 0 ? `${listing.bidCount} ${t('dashboard.bids')}` : t('dashboard.no.bids'),
    highlight: listing.bidCount > 0
  }));
  
  // Crop recommendations based on market analysis
  const cropRecommendations = [
    { name: "Green Chillies", value: "High demand", highlight: true },
    { name: "Eggplant", value: "Rising prices", highlight: true },
    { name: "Cauliflower", value: "Seasonal peak", highlight: true }
  ];
  
  // Navigation handlers for dashboard cards
  const handleViewAllPrices = () => {
    window.location.href = "/forecasts";
  };
  
  const handleManageListings = () => {
    window.location.href = "/marketplace";
  };
  
  const handleViewFullReport = () => {
    toast({
      title: "Full Report",
      description: "The detailed crop recommendation report is being generated. Check back soon!",
    });
    // Normally would redirect to a detailed forecast page
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <WelcomeBanner userName={currentUser.name} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title={t('dashboard.market.price')}
            icon={<TrendingUp className="h-6 w-6" />}
            items={marketPrices}
            actionText={t('dashboard.view.all.prices')}
            onAction={handleViewAllPrices}
            type="success"
          />
          
          <DashboardCard
            title={t('dashboard.active.listings')}
            icon={<ShoppingBasket className="h-6 w-6" />}
            items={activeListings.length > 0 ? activeListings : [
              { name: "No active listings", value: "", highlight: false }
            ]}
            actionText={t('dashboard.manage.listings')}
            onAction={handleManageListings}
            type="info"
          />
          
          <DashboardCard
            title={t('dashboard.crop.recommendations')}
            icon={<Leaf className="h-6 w-6" />}
            items={cropRecommendations}
            actionText={t('dashboard.view.full.report')}
            onAction={handleViewFullReport}
            type="accent"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content Area (Left) */}
          <div className="md:w-7/12">
            <AIPricePredictor />
            <div className="mt-8">
              <MarketplaceBrowser />
            </div>
          </div>

          {/* Sidebar Content (Right) */}
          <div className="md:w-5/12">
            <CropDemandForecast />
            <div className="mt-8">
              <SMSFeatureDemo />
            </div>
            <div className="mt-8">
              <CropBarterSystem />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
