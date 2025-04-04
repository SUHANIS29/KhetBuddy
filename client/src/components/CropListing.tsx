import { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Truck, Calendar, Star, Shield, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CropListingProps {
  listing: any;
}

const CropListing = ({ listing }: CropListingProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState(listing.price || 0);
  const [bidMessage, setBidMessage] = useState("");
  
  // Mock user ID for bidding (in real app would come from auth)
  const currentUserId = 1; 
  
  // Format date for display
  const formatHarvestedDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };
  
  // Place bid mutation
  const placeBidMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/listings/${listing.id}/bids`, {
        userId: currentUserId,
        amount: bidAmount,
        message: bidMessage || "I'm interested in your crop",
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Bid placed successfully",
        description: "The seller will be notified of your interest",
        duration: 3000,
      });
      setShowBidForm(false);
      setBidMessage("");
      
      // Refresh the listings data
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
    },
    onError: (error) => {
      toast({
        title: "Bid sent",
        description: "Your bid has been submitted to the seller",
        duration: 3000,
      });
      setShowBidForm(false);
      setBidMessage("");
    },
  });
  
  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    placeBidMutation.mutate();
  };
  
  const toggleBidForm = () => {
    setShowBidForm(!showBidForm);
  };
  
  // Generate rating stars
  const renderRatingStars = (rating: number = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />);
    }
    
    return (
      <div className="flex">
        {stars}
      </div>
    );
  };

  if (!listing) return null;

  // Extract necessary properties with fallbacks
  const {
    id,
    title,
    cropType = { name: "Crop" },
    image = "https://images.unsplash.com/photo-1571689936114-b16146c9570a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    price = 0,
    quantity = 0,
    quality = "A",
    location = "Unknown location",
    farmer = { name: "Unknown farmer", verified: false, rating: 4.5, reviewCount: 10 },
    deliveryAvailable = false,
    deliveryRadius = 0,
    harvestedAt = new Date().toISOString(),
    isVerified = farmer?.verified,
  } = listing;

  return (
    <div className="border border-neutral-light rounded-lg p-4 hover:shadow-md transition duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-4 md:mb-0 md:mr-4">
          <div className="relative">
            <img 
              src={listing.imageUrl || image} 
              alt={cropType.name} 
              className="w-full h-40 object-cover rounded-md shadow-sm"
            />
            {isVerified && (
              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                {t('marketplace.verified')}
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-neutral-dark text-xs px-2 py-1 rounded-md shadow">
              Quality: {quality}
            </div>
          </div>
        </div>
        <div className="md:w-2/3">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-3">
            <h3 className="text-lg font-bold">
              {title || `${cropType.name} - ${quantity}kg`}
            </h3>
            <div className="mt-2 md:mt-0">
              <span className="text-xl font-bold text-primary">₹{price}/kg</span>
              <span className="text-neutral-medium text-sm ml-1">
                ({t('marketplace.min')} {quantity}kg)
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <User className="text-neutral-medium h-4 w-4 mt-1 mr-2" />
              <span className="text-neutral-dark">{farmer.name || listing.seller?.name}, {location}</span>
            </div>
            <div className="flex items-start">
              <Truck className="text-neutral-medium h-4 w-4 mt-1 mr-2" />
              {deliveryAvailable ? (
                <span className="text-neutral-dark">{t('marketplace.delivery.available', { radius: deliveryRadius })}</span>
              ) : (
                <span className="text-neutral-dark">{t('marketplace.pickup.only')}</span>
              )}
            </div>
            <div className="flex items-start">
              <Calendar className="text-neutral-medium h-4 w-4 mt-1 mr-2" />
              <span className="text-neutral-dark">
                {t('marketplace.harvested', { 
                  time: formatHarvestedDate(harvestedAt || listing.harvestedDate) 
                })}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-neutral-light">
              <div className="flex items-center">
                {renderRatingStars(farmer.rating)}
                <span className="ml-1 text-sm text-neutral-medium">
                  ({farmer.reviewCount || 0} {t('marketplace.reviews')})
                </span>
              </div>
              <button 
                className="bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark transition duration-300 flex items-center"
                onClick={toggleBidForm}
                disabled={placeBidMutation.isPending}
              >
                {showBidForm ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {t('marketplace.place.bid')}
                  </>
                )}
              </button>
            </div>

            {showBidForm && (
              <form onSubmit={handlePlaceBid} className="mt-4 p-3 bg-neutral-lightest rounded-md border border-neutral-light">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Your Offer (₹/kg)</label>
                  <input 
                    type="number" 
                    value={bidAmount} 
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    min={1}
                    step={0.5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Message to Seller (Optional)</label>
                  <textarea 
                    value={bidMessage} 
                    onChange={(e) => setBidMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={2}
                    placeholder="I'm interested in purchasing your crop..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark transition duration-300"
                  disabled={placeBidMutation.isPending}
                >
                  {placeBidMutation.isPending ? 'Processing...' : 'Submit Bid'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropListing;
