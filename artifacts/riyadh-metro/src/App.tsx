import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { useEffect } from "react";
import { toast } from "sonner";

import Home from "@/pages/home";
import Planner from "@/pages/planner";
import Stations from "@/pages/stations";
import StationDetail from "@/pages/station-detail";
import SavedTrips from "@/pages/saved-trips";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Profile from "@/pages/profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access this page");
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  return <Component {...rest} />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/planner" component={Planner} />
        <Route path="/stations" component={Stations} />
        <Route path="/stations/:id" component={StationDetail} />
        
        <Route path="/saved-trips">
          {(params) => <ProtectedRoute component={SavedTrips} params={params} />}
        </Route>
        
        <Route path="/profile">
          {(params) => <ProtectedRoute component={Profile} params={params} />}
        </Route>
        
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
