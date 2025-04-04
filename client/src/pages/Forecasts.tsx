import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, AlertCircle, TrendingUp, Droplets, Sun, Wind } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CropDemandForecast from "../components/CropDemandForecast";

const Forecasts = () => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Fetch forecast data
  const { data: forecastData, isLoading } = useQuery({
    queryKey: ['/api/forecast'],
  });

  // Fetch crop types
  const { data: cropTypes = [] } = useQuery({
    queryKey: ['/api/crop-types'],
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t('forecast.title')}</h1>
      
      {/* Region selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Calendar className="mr-2 text-primary h-5 w-5" />
            <h2 className="text-lg font-bold">Regional Forecast Data</h2>
          </div>
          
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="py-2 px-4 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Regions</option>
            <option value="north">Northern Region</option>
            <option value="south">Southern Region</option>
            <option value="east">Eastern Region</option>
            <option value="west">Western Region</option>
            <option value="central">Central Region</option>
          </select>
        </div>
      </div>
      
      {/* Forecast content layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main chart area */}
        <div className="md:col-span-2">
          <CropDemandForecast />
          
          {/* Weather factors section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Weather Impact Factors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-bold text-blue-800">Rainfall</h3>
                </div>
                <p className="text-sm text-gray-700">Expected to be 15% above average in the next 3 months, benefiting rice and wheat crops.</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Sun className="h-5 w-5 text-orange-600 mr-2" />
                  <h3 className="font-bold text-orange-800">Temperature</h3>
                </div>
                <p className="text-sm text-gray-700">Predicted to rise by 2°C, which may affect tomato and onion quality in summer months.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Wind className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-bold text-gray-800">Wind Patterns</h3>
                </div>
                <p className="text-sm text-gray-700">Normal seasonal winds expected, with no significant impact on crop production.</p>
              </div>
            </div>
          </div>
          
          {/* Market trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Market Price Trends</h2>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {cropTypes.slice(0, 5).map((crop: any, index: number) => (
                    <div key={crop.id} className="flex items-center">
                      <div className={`w-2 h-10 rounded-full bg-primary-${index % 2 === 0 ? 'dark' : 'light'} mr-3`}></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{crop.name}</span>
                          <div className="flex items-center">
                            <span className={`font-semibold ${index % 3 === 0 ? 'text-green-600' : index % 3 === 1 ? 'text-red-600' : 'text-gray-600'}`}>
                              ₹{20 + index * 5}/kg
                            </span>
                            {index % 3 === 0 ? (
                              <span className="ml-2 text-xs text-green-600">↑ 5%</span>
                            ) : index % 3 === 1 ? (
                              <span className="ml-2 text-xs text-red-600">↓ 3%</span>
                            ) : (
                              <span className="ml-2 text-xs text-gray-600">→ 0%</span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className={`h-1.5 rounded-full ${index % 3 === 0 ? 'bg-green-600' : index % 3 === 1 ? 'bg-red-600' : 'bg-gray-600'}`}
                            style={{ width: `${50 + (index * 10)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar content */}
        <div className="md:col-span-1">
          {/* Crop recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">{t('dashboard.crop.recommendations')}</h2>
            
            {forecastData ? (
              <>
                <h3 className="font-semibold text-green-700 mb-2">Recommended to Plant</h3>
                <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
                  {forecastData.demandGroups.high.map((crop: string) => (
                    <li key={crop}>{crop} <span className="text-xs text-green-600">(High demand)</span></li>
                  ))}
                </ul>
                
                <h3 className="font-semibold text-red-700 mb-2">Avoid Planting</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {forecastData.demandGroups.low.map((crop: string) => (
                    <li key={crop}>{crop} <span className="text-xs text-red-600">(Low demand)</span></li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            )}
          </div>
          
          {/* Seasonal advisory */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Seasonal Advisory</h2>
            
            <div className="p-4 bg-yellow-50 rounded-lg mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Monsoon Alert</h3>
                  <p className="text-sm text-gray-700">Early monsoon expected in Southern regions. Consider early sowing of rice and pulses.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-start">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800">Market Opportunity</h3>
                  <p className="text-sm text-gray-700">Projected shortage of green vegetables in Q3. Consider intercropping to maximize returns.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Government schemes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Government Schemes</h2>
            
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold">Pradhan Mantri Fasal Bima Yojana</h3>
                <p className="text-sm text-gray-600">Crop insurance scheme offering protection against natural calamities.</p>
                <a href="#" className="text-primary text-sm font-medium mt-1 inline-block">Learn more →</a>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold">PM Kisan Samman Nidhi</h3>
                <p className="text-sm text-gray-600">Direct income support of ₹6,000 per year to eligible farmers.</p>
                <a href="#" className="text-primary text-sm font-medium mt-1 inline-block">Learn more →</a>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold">Soil Health Card Scheme</h3>
                <p className="text-sm text-gray-600">Free soil testing to help farmers improve productivity.</p>
                <a href="#" className="text-primary text-sm font-medium mt-1 inline-block">Learn more →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasts;
