import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Filter, ArrowUpDown, Plus, ExternalLink } from "lucide-react";
import CropListing from "./CropListing";

// Sample listings for demonstration
const sampleListings = [
  {
    id: 1,
    title: "Premium Quality Tomatoes",
    cropType: { name: "Tomatoes" },
    quantity: 200,
    price: 25,
    quality: "Grade A (Premium)",
    location: "Nashik, Maharashtra",
    farmer: { name: "Suresh Patel", verified: true, rating: 4.8, reviewCount: 42 },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryAvailable: true,
    deliveryRadius: 30,
    harvestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1592924357228-91a64124fc20?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"
  },
  {
    id: 2,
    title: "Organic Red Onions",
    cropType: { name: "Onions" },
    quantity: 500,
    price: 18,
    quality: "Grade A (Premium)",
    location: "Pune, Maharashtra",
    farmer: { name: "Anil Kumar", verified: true, rating: 4.5, reviewCount: 35 },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryAvailable: false,
    harvestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1581170092412-bf0e1dbd9625?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"
  }
];

const MarketplaceBrowser = () => {
  const { t } = useTranslation();
  const [sortOption, setSortOption] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch listings
  const { data: listings = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/listings'],
  });

  // Use sample data if the API doesn't return any listings
  const availableListings = listings.length > 0 ? listings : sampleListings;

  // Sort the listings based on the selected option
  const sortedListings = [...availableListings].sort((a, b) => {
    switch (sortOption) {
      case "price_high":
        return b.price - a.price;
      case "price_low":
        return a.price - b.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "nearest":
      default:
        // Sort by distance (for now, just random)
        return 0;
    }
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const navigateToAllListings = () => {
    window.location.href = "/marketplace";
  };

  const navigateToCreateListing = () => {
    window.location.href = "/create-listing";
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center">
          {t('marketplace.title')}
          <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {sortedListings.length}
          </span>
        </h2>
        <div className="flex space-x-2 items-center">
          <button 
            onClick={navigateToAllListings}
            className="text-primary font-semibold flex items-center hover:underline"
          >
            {t('marketplace.view.all')}
            <ExternalLink className="h-4 w-4 ml-1" />
          </button>
          <div className="border-r border-neutral-light h-6"></div>
          <div className="flex items-center">
            <ArrowUpDown className="h-4 w-4 mr-1 text-primary" />
            <select 
              className="bg-transparent text-primary font-semibold focus:outline-none"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="newest">{t('marketplace.sort.newest')}</option>
              <option value="price_high">{t('marketplace.sort.price.high')}</option>
              <option value="price_low">{t('marketplace.sort.price.low')}</option>
              <option value="nearest">{t('marketplace.sort.nearest')}</option>
            </select>
          </div>
          <button 
            onClick={toggleFilters}
            className="text-primary p-1 rounded hover:bg-primary-light hover:bg-opacity-10"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="mb-4 p-3 bg-neutral-lightest rounded-md">
          <div className="flex flex-wrap gap-3">
            <select className="px-3 py-1 rounded border border-neutral-light text-sm">
              <option>All Crops</option>
              <option value="tomato">Tomatoes</option>
              <option value="onion">Onions</option>
              <option value="potato">Potatoes</option>
              <option value="rice">Rice</option>
              <option value="wheat">Wheat</option>
              <option value="cauliflower">Cauliflower</option>
              <option value="eggplant">Eggplant</option>
              <option value="chillies">Green Chillies</option>
            </select>
            <select className="px-3 py-1 rounded border border-neutral-light text-sm">
              <option>Any Quality</option>
              <option value="premium">Premium (Grade A)</option>
              <option value="standard">Standard (Grade B)</option>
              <option value="basic">Basic (Grade C)</option>
            </select>
            <select className="px-3 py-1 rounded border border-neutral-light text-sm">
              <option>Any Location</option>
              <option value="pune">Pune</option>
              <option value="nashik">Nashik</option>
              <option value="nagpur">Nagpur</option>
              <option value="mumbai">Mumbai</option>
              <option value="ahmednagar">Ahmednagar</option>
            </select>
            <button className="ml-auto px-3 py-1 bg-primary text-white rounded text-sm">Apply Filters</button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-medium">Loading listings...</p>
          </div>
        ) : sortedListings.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-neutral-medium">No listings found.</p>
          </div>
        ) : (
          <>
            {sortedListings.map((listing: any) => (
              <CropListing key={listing.id} listing={listing} />
            ))}
            <button 
              onClick={navigateToCreateListing}
              className="mt-4 w-full border border-dashed border-primary text-primary flex items-center justify-center p-4 rounded-lg hover:bg-primary-light hover:bg-opacity-5 transition-colors"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Listing
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketplaceBrowser;
