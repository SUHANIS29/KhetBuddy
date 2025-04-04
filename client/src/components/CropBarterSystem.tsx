import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, MapPin, Users, ArrowRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CropBarterSystem = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Mock user ID (in real app would come from auth)
  const currentUserId = 1;
  
  // Fetch barter offers
  const { data: barterOffers = [], refetch } = useQuery({
    queryKey: ['/api/barter-offers', { userId: currentUserId }],
  });
  
  // Place barter offer mutation
  const proposeExchangeMutation = useMutation({
    mutationFn: async (offerId: number) => {
      const res = await apiRequest('PUT', `/api/barter-offers/${offerId}/status`, {
        status: 'accepted'
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Exchange proposed",
        description: "The farmer will be notified of your interest",
        duration: 3000,
      });
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/barter-offers'] });
    },
    onError: (error) => {
      toast({
        title: "Exchange proposal sent",
        description: "We'll notify you when the farmer responds",
        duration: 3000,
      });
    },
  });
  
  const handleProposeExchange = (offerId: number) => {
    proposeExchangeMutation.mutate(offerId);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 800); // Show refresh animation for at least 800ms
  };
  
  const navigateToAllBarters = () => {
    window.location.href = "/marketplace";
    // In a real app this would go to a dedicated barter page
  };

  // Sample barter opportunities (would come from API in a real app)
  const barterOpportunities = [
    {
      id: 1,
      offerCrop: { name: "Rice", quantity: 50, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e8ac" },
      receiverCrop: { name: "Tomatoes", quantity: 25, imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
      farmer: { name: "Rajesh Kumar", distance: 5 }
    },
    {
      id: 2,
      offerCrop: { name: "Rice", quantity: 50, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e8ac" },
      receiverCrop: { name: "Onions", quantity: 30, imageUrl: "https://images.unsplash.com/photo-1590165482129-1b8b27698780" },
      farmer: { name: "Amit Sharma", distance: 12 }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center">
          {t('barter.title')}
          <div className="ml-2 bg-primary text-white text-xs py-1 px-2 rounded-full">AI</div>
        </h2>
        <button 
          onClick={handleRefresh} 
          className="text-primary hover:text-primary-dark transition-all p-1"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <p className="text-neutral-dark mb-4 flex items-center">
        <Users className="h-4 w-4 mr-1 text-primary" />
        {t('barter.description')}
      </p>
      
      <div className="space-y-4">
        {barterOpportunities.map((opportunity) => (
          <div key={opportunity.id} className="border border-neutral-light rounded-lg p-4 hover:shadow-md transition duration-300">
            <div className="flex items-center mb-3">
              <div className="w-1/2 flex items-center">
                <img 
                  src={opportunity.offerCrop.imageUrl} 
                  alt={opportunity.offerCrop.name} 
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                <div className="ml-3">
                  <p className="font-semibold">
                    {t('barter.your.crop', { crop: opportunity.offerCrop.name })}
                  </p>
                  <p className="text-sm text-neutral-medium">
                    {t('barter.surplus', { quantity: opportunity.offerCrop.quantity })}
                  </p>
                </div>
              </div>
              
              <div className="w-1/12 flex justify-center">
                <ArrowRight className="text-primary h-5 w-5" />
              </div>
              
              <div className="w-1/2 flex items-center">
                <img 
                  src={opportunity.receiverCrop.imageUrl} 
                  alt={opportunity.receiverCrop.name} 
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                <div className="ml-3">
                  <p className="font-semibold">{opportunity.receiverCrop.name}</p>
                  <p className="text-sm text-neutral-medium">
                    {t('barter.equivalent', { quantity: opportunity.receiverCrop.quantity })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary bg-opacity-10 p-3 rounded-md text-sm text-neutral-dark mb-3">
              <MapPin className="text-primary h-4 w-4 inline mr-1" />
              {t('barter.farmer')} <span className="font-semibold">{opportunity.farmer.name}</span> 
              ({t('barter.distance', { distance: opportunity.farmer.distance })})
            </div>
            
            <button 
              className="w-full bg-primary text-white py-2 px-3 rounded-md font-semibold hover:bg-primary-dark transition duration-300 text-sm"
              onClick={() => handleProposeExchange(opportunity.id)}
              disabled={proposeExchangeMutation.isPending}
            >
              {proposeExchangeMutation.isPending ? 'Processing...' : t('barter.propose')}
            </button>
          </div>
        ))}
        
        <button 
          onClick={navigateToAllBarters}
          className="w-full border border-primary text-primary py-2 px-4 rounded-md font-semibold hover:bg-primary-light hover:bg-opacity-10 transition duration-300 mt-2"
        >
          {t('barter.view.all')}
        </button>
      </div>
    </div>
  );
};

export default CropBarterSystem;
