import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Camera, Upload, Calendar, Truck, AlertCircle, CheckCircle, Mic, MicOff } from "lucide-react";

// Form schema
const listingSchema = z.object({
  cropTypeId: z.string().min(1, "Crop type is required"),
  quantity: z.string().min(1, "Quantity is required"),
  price: z.string().min(1, "Price is required"),
  quality: z.string().min(1, "Quality is required"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  location: z.string().min(1, "Location is required"),
  harvestedDate: z.string().min(1, "Harvested date is required"),
  deliveryAvailable: z.boolean().optional(),
  deliveryRadius: z.string().optional(),
  imageUrl: z.string().optional(),
});

type ListingFormValues = z.infer<typeof listingSchema>;

const CreateListing = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");

  // Fetch crop types
  const { data: apiCropTypes = [] } = useQuery<any[]>({
    queryKey: ['/api/crop-types'],
  });
  
  // Sample crop types if API doesn't return any
  const sampleCropTypes = [
    { id: 1, name: 'Tomatoes' },
    { id: 2, name: 'Onions' },
    { id: 3, name: 'Potatoes' },
    { id: 4, name: 'Rice' },
    { id: 5, name: 'Wheat' },
    { id: 6, name: 'Green Chillies' },
    { id: 7, name: 'Eggplant' },
    { id: 8, name: 'Cauliflower' }
  ];
  
  // Use API crop types if available, otherwise use sample crop types
  const cropTypes = apiCropTypes.length > 0 ? apiCropTypes : sampleCropTypes;

  // Setup form
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      cropTypeId: "",
      quantity: "",
      price: "",
      quality: "A",
      description: "",
      location: "",
      harvestedDate: new Date().toISOString().slice(0, 10),
      deliveryAvailable: true,
      deliveryRadius: "50",
      imageUrl: "",
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  
  // Watch the deliveryAvailable field to conditionally show delivery radius
  const deliveryAvailable = watch("deliveryAvailable");

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: async (data: any) => {
      // Parse the date properly
      let harvestedDateObj;
      try {
        harvestedDateObj = new Date(data.harvestedDate);
        // Check if date is valid
        if (isNaN(harvestedDateObj.getTime())) {
          throw new Error("Invalid harvested date");
        }
      } catch (error) {
        throw new Error("Invalid harvested date format");
      }

      const res = await apiRequest('POST', '/api/listings', {
        ...data,
        cropTypeId: parseInt(data.cropTypeId),
        quantity: parseFloat(data.quantity),
        price: parseFloat(data.price),
        deliveryRadius: data.deliveryAvailable ? parseInt(data.deliveryRadius) : null,
        harvestedDate: harvestedDateObj.toISOString(),
        // Get user ID from auth context
        userId: user ? user.id : 1,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Listing created",
        description: "Your crop has been listed on the marketplace",
      });
      navigate("/marketplace");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ListingFormValues) => {
    createListingMutation.mutate(data);
  };

  // Handle image upload (mock for demo)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // For this demo, we'll create a local object URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      
      // Set the image URL for the form
      setValue("imageUrl", imageUrl);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">List Your Crop</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Crop Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="cropTypeId">
                    Crop Type*
                  </label>
                  <select 
                    id="cropTypeId" 
                    className={`w-full px-3 py-2 border ${errors.cropTypeId ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register("cropTypeId")}
                  >
                    <option value="">Select crop type</option>
                    {cropTypes.map((crop: any) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name}
                      </option>
                    ))}
                  </select>
                  {errors.cropTypeId && (
                    <p className="text-red-500 text-sm mt-1">{errors.cropTypeId.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="quality">
                    Quality Grade*
                  </label>
                  <select 
                    id="quality" 
                    className={`w-full px-3 py-2 border ${errors.quality ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register("quality")}
                  >
                    <option value="A">{t('quality.premium')}</option>
                    <option value="B">{t('quality.standard')}</option>
                    <option value="C">{t('quality.basic')}</option>
                  </select>
                  {errors.quality && (
                    <p className="text-red-500 text-sm mt-1">{errors.quality.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="quantity">
                    Quantity (kg)*
                  </label>
                  <input 
                    type="number" 
                    id="quantity" 
                    className={`w-full px-3 py-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="Enter quantity"
                    {...register("quantity")}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="price">
                    Price per kg (₹)*
                  </label>
                  <input 
                    type="number" 
                    id="price" 
                    className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="Enter price"
                    {...register("price")}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="harvestedDate">
                    Harvested Date*
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input 
                      type="date" 
                      id="harvestedDate" 
                      className={`w-full pl-10 px-3 py-2 border ${errors.harvestedDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      {...register("harvestedDate")}
                    />
                  </div>
                  {errors.harvestedDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.harvestedDate.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="location">
                    Location*
                  </label>
                  <select 
                    id="location" 
                    className={`w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register("location")}
                  >
                    <option value="">Select location</option>
                    <option value="Pune">Pune</option>
                    <option value="Nashik">Nashik</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Ahmednagar">Ahmednagar</option>
                  </select>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-gray-700 font-medium" htmlFor="description">
                    Description*
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isRecording) {
                        setIsRecording(true);
                        // Simulate voice recognition after a brief delay
                        setTimeout(() => {
                          const sampleDescriptions = [
                            "Fresh organic tomatoes harvested yesterday. Bright red color with firm texture. No pesticides used.",
                            "Premium quality wheat grown using traditional methods. Clean, well-sorted grains with high protein content.",
                            "Freshly harvested potatoes with smooth skin and no blemishes. Medium to large size, perfect for various cooking methods."
                          ];
                          const newText = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
                          setRecordedText(newText);
                          setValue("description", newText);
                          setIsRecording(false);
                          toast({
                            title: "Voice input captured",
                            description: "Your spoken description has been added to the form",
                          });
                        }, 2000);
                      } else {
                        setIsRecording(false);
                      }
                    }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      isRecording 
                        ? 'bg-red-100 text-red-600 border border-red-300 animate-pulse' 
                        : 'bg-primary-50 text-primary hover:bg-primary-100 border border-primary-200'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-4 w-4" /> Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" /> Voice Input
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <textarea 
                    id="description" 
                    rows={3}
                    className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md ${isRecording ? 'border-red-500 bg-red-50' : ''}`}
                    placeholder={isRecording ? "Speaking... describe your crop's quality, freshness, and special features" : "Describe your crop quality, features, etc."}
                    {...register("description")}
                    value={watch("description")}
                    onChange={(e) => setValue("description", e.target.value)}
                  ></textarea>
                  {isRecording && (
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <span className="h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                      <span className="h-2 w-2 bg-red-500 rounded-full animate-ping delay-150"></span>
                      <span className="h-2 w-2 bg-red-500 rounded-full animate-ping delay-300"></span>
                    </div>
                  )}
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
                {isRecording && (
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <Mic className="h-3 w-3 text-red-500 mr-1" /> Listening... speak clearly in your local language
                  </p>
                )}
              </div>
            </div>
            
            {/* Delivery Options */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Options</h2>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="deliveryAvailable"
                  className="mr-2 h-4 w-4 text-primary rounded"
                  {...register("deliveryAvailable")}
                />
                <label htmlFor="deliveryAvailable" className="text-gray-700">
                  Delivery available
                </label>
              </div>
              
              {deliveryAvailable && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="deliveryRadius">
                    Delivery Radius (km)
                  </label>
                  <div className="flex items-center">
                    <Truck className="text-gray-400 h-5 w-5 mr-2" />
                    <input 
                      type="number" 
                      id="deliveryRadius" 
                      className={`flex-grow px-3 py-2 border ${errors.deliveryRadius ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      placeholder="Maximum delivery distance"
                      {...register("deliveryRadius")}
                    />
                  </div>
                  {errors.deliveryRadius && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryRadius.message}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Image Upload */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4">Crop Image (Optional)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-52">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Crop preview" 
                      className="h-full object-contain"
                    />
                  ) : (
                    <>
                      <Camera className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 text-center mb-2">
                        Upload a photo of your crop
                      </p>
                      <p className="text-gray-400 text-xs text-center mb-4">
                        (Recommended: Clear image showing crop quality)
                      </p>
                    </>
                  )}
                  
                  <label className="cursor-pointer bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition">
                    <Upload className="h-4 w-4 inline mr-1" />
                    <input 
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    {previewImage ? 'Change Image' : 'Select Image'}
                  </label>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-primary mr-1" /> 
                    Why add an image?
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                      Listings with images receive up to 3x more buyer interest
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                      Our AI can analyze crop quality from images for better pricing
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                      Buyers are more confident when they can see product quality
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="border-t border-gray-200 pt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/marketplace")}
                className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={createListingMutation.isPending}
                className="py-2 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition"
              >
                {createListingMutation.isPending ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
