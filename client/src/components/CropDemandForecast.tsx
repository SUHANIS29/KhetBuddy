import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Chart from "chart.js/auto";
import { useQuery } from "@tanstack/react-query";

// Sample forecast data by period for demonstration when API data isn't available
const sampleForecastByPeriod = {
  next_month: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        cropName: "Tomatoes",
        data: [65, 72, 78, 85]
      },
      {
        cropName: "Onions",
        data: [45, 52, 58, 63]
      },
      {
        cropName: "Rice",
        data: [80, 78, 75, 72]
      }
    ],
    demandGroups: {
      high: ["Tomatoes", "Green Chillies", "Eggplant"],
      moderate: ["Onions", "Cauliflower", "Beans"],
      low: ["Rice", "Wheat", "Corn"]
    }
  },
  three_months: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      {
        cropName: "Potatoes",
        data: [55, 65, 75]
      },
      {
        cropName: "Wheat",
        data: [70, 75, 80]
      },
      {
        cropName: "Cauliflower",
        data: [40, 52, 65]
      }
    ],
    demandGroups: {
      high: ["Wheat", "Potatoes", "Cauliflower"],
      moderate: ["Carrots", "Beans", "Peas"],
      low: ["Tomatoes", "Eggplant", "Onions"]
    }
  },
  six_months: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        cropName: "Tomatoes",
        data: [65, 72, 78, 85, 92, 88]
      },
      {
        cropName: "Onions",
        data: [45, 52, 58, 63, 70, 75]
      },
      {
        cropName: "Rice",
        data: [80, 78, 75, 72, 68, 65]
      }
    ],
    demandGroups: {
      high: ["Tomatoes", "Green Chillies", "Eggplant"],
      moderate: ["Onions", "Cauliflower", "Beans"],
      low: ["Rice", "Wheat", "Corn"]
    }
  }
};

const CropDemandForecast = () => {
  const { t } = useTranslation();
  const [forecastPeriod, setForecastPeriod] = useState("next_month");
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Fetch forecast data
  const { data: apiData, isLoading } = useQuery<any>({
    queryKey: ['/api/forecast'],
  });
  
  // Use sample data if API data isn't available
  const forecastData = apiData || sampleForecastByPeriod[forecastPeriod as keyof typeof sampleForecastByPeriod];

  useEffect(() => {
    // Wait a brief moment to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      if (!chartRef.current) return;

      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      // Prepare datasets for the chart
      const datasets = forecastData.datasets.map((dataset: any, index: number) => {
        const colors = [
          { border: '#388E3C', background: 'rgba(56, 142, 60, 0.1)' },   // Green
          { border: '#1976D2', background: 'rgba(25, 118, 210, 0.1)' },  // Blue
          { border: '#D32F2F', background: 'rgba(211, 47, 47, 0.1)' }    // Red
        ];
        
        const colorSet = colors[index % colors.length];
        
        return {
          label: dataset.cropName,
          data: dataset.data,
          borderColor: colorSet.border,
          backgroundColor: colorSet.background,
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: colorSet.border,
          pointRadius: 4,
          pointHoverRadius: 6
        };
      });

      // Create the chart
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: forecastData.labels,
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 10,
              cornerRadius: 4,
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.parsed.y} (Demand Index)`;
                }
              }
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              border: {
                display: false
              },
              ticks: {
                padding: 8,
                color: '#666'
              },
              title: {
                display: true,
                text: 'Demand Index',
                color: '#666',
                font: {
                  weight: 'bold'
                },
                padding: {top: 10, bottom: 10}
              }
            },
            x: {
              grid: {
                display: false
              },
              border: {
                display: false
              },
              ticks: {
                padding: 8,
                color: '#666'
              },
              title: {
                display: true,
                text: forecastPeriod === 'next_month' ? 'Days' : 'Months',
                color: '#666',
                font: {
                  weight: 'bold'
                },
                padding: {top: 10, bottom: 0}
              }
            }
          }
        }
      });
    }, 300); // Brief delay to ensure component is mounted

    return () => {
      clearTimeout(timer);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [forecastData, forecastPeriod]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForecastPeriod(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center">
          {t('forecast.title')}
          <div className="ml-2 bg-primary text-white text-xs py-1 px-2 rounded-full">AI</div>
        </h2>
        <select 
          className="bg-transparent text-primary font-semibold focus:outline-none text-sm"
          value={forecastPeriod}
          onChange={handlePeriodChange}
        >
          <option value="next_month">{t('forecast.next.month')}</option>
          <option value="three_months">{t('forecast.three.months')}</option>
          <option value="six_months">{t('forecast.six.months')}</option>
        </select>
      </div>
      
      <div className="h-64 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100 shadow-inner">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="ml-3 text-gray-500">Loading forecast data...</p>
          </div>
        ) : (
          <div className="h-full w-full relative">
            <canvas ref={chartRef} className="max-h-full"></canvas>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-transparent to-gray-50 opacity-10"></div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-center mb-4 text-xs text-gray-500">
        <div className="flex items-center mr-3">
          <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
          <span>High demand</span>
        </div>
        <div className="flex items-center mr-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
          <span>Medium demand</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-red-600 rounded-full mr-1"></div>
          <span>Low demand</span>
        </div>
      </div>
      
      {forecastData && (
        <div className="space-y-4 mt-6">
          <div className="p-3 bg-[#388E3C] bg-opacity-10 rounded-md">
            <div className="flex">
              <div className="w-2 bg-[#388E3C] rounded-full mr-3"></div>
              <div>
                <h4 className="font-semibold">{t('forecast.high.demand')}</h4>
                <p className="text-sm text-neutral-medium">
                  {forecastData.demandGroups.high.join(', ')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-[#1976D2] bg-opacity-10 rounded-md">
            <div className="flex">
              <div className="w-2 bg-[#1976D2] rounded-full mr-3"></div>
              <div>
                <h4 className="font-semibold">{t('forecast.moderate.demand')}</h4>
                <p className="text-sm text-neutral-medium">
                  {forecastData.demandGroups.moderate.join(', ')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-[#D32F2F] bg-opacity-10 rounded-md">
            <div className="flex">
              <div className="w-2 bg-[#D32F2F] rounded-full mr-3"></div>
              <div>
                <h4 className="font-semibold">{t('forecast.low.demand')}</h4>
                <p className="text-sm text-neutral-medium">
                  {forecastData.demandGroups.low.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropDemandForecast;
