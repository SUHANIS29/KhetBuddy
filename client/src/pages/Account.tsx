import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { User, Lock, FileText, Tractor, CheckCircle, ShoppingBag, Truck, Package, MapPin, PlusCircle } from "lucide-react";

interface AccountProps {
  isLoggedIn: boolean;
  currentUser: any;
  onLogin: (userData: any) => void;
  onLogout: () => void;
}

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.string().min(1, "Role is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Account = ({ isLoggedIn, currentUser, onLogin, onLogout }: AccountProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile"); // profile, transactions, listings, orders
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Registration form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      location: "",
      phoneNumber: "",
      role: "farmer",
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiRequest('POST', '/api/auth/login', data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.name}!`,
      });
      onLogin(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const res = await apiRequest('POST', '/api/auth/register', data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration successful",
        description: `Welcome to AgriNet, ${data.name}!`,
      });
      onLogin(data);
      setIsRegistering(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Handle registration form submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  // Handle logout
  const handleLogout = () => {
    onLogout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-6">
            <button
              className={`py-2 px-4 font-semibold ${!isRegistering ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setIsRegistering(false)}
            >
              {t('auth.login')}
            </button>
            <button
              className={`py-2 px-4 font-semibold ${isRegistering ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setIsRegistering(true)}
            >
              {t('auth.register')}
            </button>
          </div>

          {isRegistering ? (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="reg-username">
                  {t('auth.username')}
                </label>
                <input
                  id="reg-username"
                  type="text"
                  {...registerForm.register("username")}
                  className={`w-full px-3 py-2 border ${registerForm.formState.errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {registerForm.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="reg-password">
                  {t('auth.password')}
                </label>
                <input
                  id="reg-password"
                  type="password"
                  {...registerForm.register("password")}
                  className={`w-full px-3 py-2 border ${registerForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                  {t('auth.name')}
                </label>
                <input
                  id="name"
                  type="text"
                  {...registerForm.register("name")}
                  className={`w-full px-3 py-2 border ${registerForm.formState.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="location">
                  {t('auth.location')}
                </label>
                <select
                  id="location"
                  {...registerForm.register("location")}
                  className={`w-full px-3 py-2 border ${registerForm.formState.errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                >
                  <option value="">Select location</option>
                  <option value="Pune">Pune</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Ahmednagar">Ahmednagar</option>
                </select>
                {registerForm.formState.errors.location && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="phoneNumber">
                  {t('auth.phone')}
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  {...registerForm.register("phoneNumber")}
                  className={`w-full px-3 py-2 border ${registerForm.formState.errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {registerForm.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {t('auth.role')}
                </label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="farmer"
                      {...registerForm.register("role")}
                      defaultChecked
                      className="mr-2"
                    />
                    {t('auth.role.farmer')}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="buyer"
                      {...registerForm.register("role")}
                      className="mr-2"
                    />
                    {t('auth.role.buyer')}
                  </label>
                </div>
                {registerForm.formState.errors.role && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.role.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition duration-300"
              >
                {registerMutation.isPending ? 'Processing...' : t('auth.register')}
              </button>
            </form>
          ) : (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="username">
                  {t('auth.username')}
                </label>
                <input
                  id="username"
                  type="text"
                  {...loginForm.register("username")}
                  className={`w-full px-3 py-2 border ${loginForm.formState.errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {loginForm.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                  {t('auth.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  {...loginForm.register("password")}
                  className={`w-full px-3 py-2 border ${loginForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition duration-300"
              >
                {loginMutation.isPending ? 'Logging in...' : t('auth.login')}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile header */}
        <div className="bg-primary text-white p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center text-4xl font-bold mb-4 md:mb-0 md:mr-6">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-primary-light mb-2">{currentUser.role === 'farmer' ? 'Farmer' : 'Buyer'}</p>
              <div className="flex flex-col md:flex-row md:space-x-4 items-center text-sm">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" /> @{currentUser.username || 'username'}
                </span>
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> {currentUser.location}
                </span>
              </div>
            </div>
            <div className="ml-auto hidden md:block">
              <button
                onClick={handleLogout}
                className="bg-white text-primary py-2 px-4 rounded-md font-semibold hover:bg-opacity-90 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-6 font-medium ${activeTab === "profile" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`py-4 px-6 font-medium ${activeTab === "listings" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              My Listings
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-4 px-6 font-medium ${activeTab === "transactions" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
            >
              <ShoppingBag className="h-4 w-4 inline mr-2" />
              Transactions
            </button>
            {currentUser.role === 'buyer' && (
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-6 font-medium ${activeTab === "orders" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
              >
                <Package className="h-4 w-4 inline mr-2" />
                My Orders
              </button>
            )}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">Full Name</label>
                    <p className="text-gray-800 font-medium">{currentUser.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">Username</label>
                    <p className="text-gray-800 font-medium">@{currentUser.username || 'username'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">Role</label>
                    <p className="text-gray-800 font-medium">{currentUser.role === 'farmer' ? 'Farmer' : 'Buyer'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">Location</label>
                    <p className="text-gray-800 font-medium">{currentUser.location}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">Phone Number</label>
                    <p className="text-gray-800 font-medium">{currentUser.phoneNumber || '+91 1234567890'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">Account Status</label>
                    <p className="text-green-600 font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" /> Verified
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-bold text-lg mb-3">Account Settings</h3>
                <div className="space-y-3">
                  <button className="flex items-center text-gray-600 hover:text-primary">
                    <Lock className="h-4 w-4 mr-2" /> Change Password
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-primary">
                    <User className="h-4 w-4 mr-2" /> Edit Profile
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="md:hidden flex items-center text-red-600"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg> 
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "listings" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">My Crop Listings</h2>
                
                <Link to="/create-listing">
                  <button className="bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark transition duration-300 flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" /> Add New Listing
                  </button>
                </Link>
              </div>
              
              {currentUser.role !== 'farmer' ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Tractor className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Buyer Account</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    You're using a buyer account, which can't create crop listings. 
                    Switch to a farmer account to sell your crops.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Sample listing cards would go here */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/6 mb-4 md:mb-0">
                        <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                          <Tractor className="h-10 w-10 text-gray-400" />
                        </div>
                      </div>
                      <div className="md:w-5/6 md:pl-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold">Rice (50kg)</h3>
                          <span className="text-primary font-bold">₹42/kg</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Grade A</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">3 Bids</span>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Delivery Available</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                          <span className="text-gray-500 text-sm">Listed on June 5, 2023</span>
                          <div className="space-x-2">
                            <button className="text-gray-600 hover:text-primary text-sm">Edit</button>
                            <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                            <button className="text-primary hover:text-primary-dark text-sm font-semibold">View Bids</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/6 mb-4 md:mb-0">
                        <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                          <Tractor className="h-10 w-10 text-gray-400" />
                        </div>
                      </div>
                      <div className="md:w-5/6 md:pl-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold">Wheat (100kg)</h3>
                          <span className="text-primary font-bold">₹38/kg</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Grade A</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">5 Bids</span>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Delivery Available</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                          <span className="text-gray-500 text-sm">Listed on May 28, 2023</span>
                          <div className="space-x-2">
                            <button className="text-gray-600 hover:text-primary text-sm">Edit</button>
                            <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                            <button className="text-primary hover:text-primary-dark text-sm font-semibold">View Bids</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "transactions" && (
            <div>
              <h2 className="text-xl font-bold mb-6">Transaction History</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Jun 10, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Sale
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        50kg Rice to Mohan Patel
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        +₹2,100
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        May 28, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Purchase
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        25kg Tomatoes from Anita Singh
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        -₹625
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        May 15, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Barter
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        30kg Rice for 15kg Onions with Suresh Kumar
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        Exchange
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-bold mb-6">My Orders</h2>
              
              {currentUser.role !== 'buyer' ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Package className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Farmer Account</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    You're using a farmer account. This section is for buyers to track their orders.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div>
                        <span className="text-gray-600 text-sm">Order ID: #9876</span>
                        <span className="ml-4 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                          In Transit
                        </span>
                      </div>
                      <span className="text-gray-600 text-sm">Ordered on: Jun 8, 2023</span>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/6 mb-4 md:mb-0">
                          <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                            <Truck className="h-10 w-10 text-gray-400" />
                          </div>
                        </div>
                        <div className="md:w-5/6 md:pl-4">
                          <h3 className="font-semibold mb-2">100kg Wheat</h3>
                          <p className="text-gray-600 mb-2">
                            Seller: Suresh Kumar, Nagpur
                          </p>
                          <div className="flex justify-between">
                            <span className="text-gray-600">₹32/kg</span>
                            <span className="font-bold">Total: ₹3,200</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center">
                          <Truck className="h-5 w-5 text-primary mr-2" />
                          <span className="text-gray-600">Expected delivery: Jun 12, 2023</span>
                        </div>
                        <button className="text-primary hover:text-primary-dark font-semibold">
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div>
                        <span className="text-gray-600 text-sm">Order ID: #9542</span>
                        <span className="ml-4 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                          Delivered
                        </span>
                      </div>
                      <span className="text-gray-600 text-sm">Ordered on: May 25, 2023</span>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/6 mb-4 md:mb-0">
                          <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                            <Truck className="h-10 w-10 text-gray-400" />
                          </div>
                        </div>
                        <div className="md:w-5/6 md:pl-4">
                          <h3 className="font-semibold mb-2">50kg Tomatoes</h3>
                          <p className="text-gray-600 mb-2">
                            Seller: Anita Singh, Pune
                          </p>
                          <div className="flex justify-between">
                            <span className="text-gray-600">₹25/kg</span>
                            <span className="font-bold">Total: ₹1,250</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-gray-600">Delivered on: May 28, 2023</span>
                        </div>
                        <button className="text-primary hover:text-primary-dark font-semibold">
                          Leave Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
