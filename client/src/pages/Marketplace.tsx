import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CropListing from "../components/CropListing";

const Marketplace = () => {
  const { t } = useTranslation();
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCropType, setSelectedCropType] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Fetch listings
  const { data: listings = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/listings'],
    refetchInterval: 5000,  // Refetch every 5 seconds
    refetchOnWindowFocus: true,
    staleTime: 0 // Consider data stale immediately
  });
  
  // Log the listings for debugging
  console.log("Listings from API:", listings);

  // Fetch crop types for filter
  const { data: cropTypes = [] } = useQuery<any[]>({
    queryKey: ['/api/crop-types'],
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  // Filter and sort listings
  const filteredListings = listings.filter((listing: any) => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      (listing.description && listing.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (listing.cropType && listing.cropType.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by crop type
    const matchesCropType = !selectedCropType || listing.cropTypeId.toString() === selectedCropType;
    
    // Filter by quality
    const matchesQuality = !selectedQuality || listing.quality === selectedQuality;
    
    return matchesSearch && matchesCropType && matchesQuality;
  });

  // Sort the filtered listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortOption) {
      case "price_high":
        return b.price - a.price;
      case "price_low":
        return a.price - b.price;
      case "nearest":
        // In a real app, this would sort by distance from user's location
        return 0;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{t('marketplace.title')}</h1>
        
        {/* Search and filter bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by crop name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 px-4 bg-gray-50 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="py-2 px-4 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">{t('marketplace.sort.newest')}</option>
                <option value="price_high">{t('marketplace.sort.price.high')}</option>
                <option value="price_low">{t('marketplace.sort.price.low')}</option>
                <option value="nearest">{t('marketplace.sort.nearest')}</option>
              </select>
              
              <button 
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className="py-2 px-4 bg-primary text-white rounded-md flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" /> 
                <span className="hidden md:inline">Filters</span>
              </button>
            </div>
          </div>
          
          {/* Advanced filters */}
          {isFiltersVisible && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                <select
                  value={selectedCropType}
                  onChange={(e) => setSelectedCropType(e.target.value)}
                  className="py-2 px-4 bg-gray-50 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Crop Types</option>
                  {cropTypes.map((crop: any) => (
                    <option key={crop.id} value={crop.id.toString()}>
                      {crop.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="py-2 px-4 bg-gray-50 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Qualities</option>
                  <option value="A">{t('quality.premium')}</option>
                  <option value="B">{t('quality.standard')}</option>
                  <option value="C">{t('quality.basic')}</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setSelectedCropType("");
                    setSelectedQuality("");
                    setSearchQuery("");
                  }}
                  className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md w-full"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Listings */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading marketplace listings...</p>
            </div>
          ) : sortedListings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <SlidersHorizontal className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">No listings found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria to find crop listings.
              </p>
            </div>
          ) : (
            sortedListings.map((listing: any) => (
              <CropListing key={listing.id} listing={listing} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
