import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

import Header from "./components/Header";
import MobileNavigation from "./components/MobileNavigation";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Forecasts from "./pages/Forecasts";
import AuthPage from "./pages/auth-page";
import NotFound from "@/pages/not-found";
import CreateListing from "./pages/CreateListing";
import Account from "./pages/Account";
import { ProtectedRoute } from "./lib/protected-route";

// Create a new query client
const queryClient = new QueryClient();

function AppRoutes() {
  const { i18n } = useTranslation();
  const { user, isLoading, logoutMutation } = useAuth();

  // Handle language change
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        isLoggedIn={!!user} 
        changeLanguage={changeLanguage} 
        currentLanguage={i18n.language}
      />
      
      <div className="flex-grow">
        <Switch>
          <ProtectedRoute path="/" component={() => <Home currentUser={user!} />} />
          <ProtectedRoute path="/marketplace" component={Marketplace} />
          <ProtectedRoute path="/forecasts" component={Forecasts} />
          <ProtectedRoute path="/create-listing" component={CreateListing} />
          <ProtectedRoute path="/account" component={() => <Account 
            isLoggedIn={!!user} 
            currentUser={user!} 
            onLogin={() => {}} 
            onLogout={() => logoutMutation.mutate()}
          />} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      
      <MobileNavigation />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
