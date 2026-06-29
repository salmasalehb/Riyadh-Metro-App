import { useState } from "react";
import { useLocation } from "wouter";
import { Map, MapPin, Search, ArrowRight, User as UserIcon, LogOut, Award, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-primary" />
          My Profile
        </h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50" data-testid="btn-logout">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold uppercase shrink-0">
            {user.name.charAt(0)}
          </div>
          
          <div className="text-center md:text-left flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </Badge>
              <Badge className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
                <Award className="w-3 h-3" />
                {user.rewardPoints || 0} Reward Points
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setLocation("/saved-trips")}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">Saved Trips</h3>
            <p className="text-sm text-gray-500 mb-4">Access your frequently used routes.</p>
            <Button variant="outline" className="w-full" data-testid="btn-go-saved-trips">View Saved Trips</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setLocation("/planner")}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">Trip Planner</h3>
            <p className="text-sm text-gray-500 mb-4">Plan a new journey across the network.</p>
            <Button variant="outline" className="w-full" data-testid="btn-go-planner">Plan a Trip</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
