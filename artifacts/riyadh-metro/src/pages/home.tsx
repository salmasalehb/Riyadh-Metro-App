import { useState } from "react";
import { useLocation } from "wouter";
import { Map, MapPin, Search, ArrowRight, Activity, Users, Train, ArrowDown } from "lucide-react";
import { useGetNetworkSummary, useListStations } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: networkSummary, isLoading, error } = useGetNetworkSummary();
  const { data: stations, isLoading: loadingStations } = useListStations();

  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");

  const handleQuickPlan = () => {
    if (!originId || !destinationId) {
      toast.error("Please select both stations");
      return;
    }
    setLocation(`/planner?origin=${originId}&destination=${destinationId}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Riyadh Metro
          </h1>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-8 font-medium">
            Smart, fast, and sustainable mobility across the capital.
          </p>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-md text-white shadow-xl mt-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-4 w-full">
                  <div className="relative">
                    <div className="flex items-center">
                      <div className="w-8 flex justify-center shrink-0">
                        <div className="w-3 h-3 rounded-full border-2 border-white"></div>
                      </div>
                      <Select value={originId} onValueChange={setOriginId}>
                        <SelectTrigger className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-white/50" data-testid="select-origin-home">
                          <SelectValue placeholder={loadingStations ? "Loading..." : "Where from?"} />
                        </SelectTrigger>
                        <SelectContent>
                          {stations?.map(s => (
                            <SelectItem key={`orig-${s.id}`} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center">
                      <div className="w-8 flex justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <Select value={destinationId} onValueChange={setDestinationId}>
                        <SelectTrigger className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-white/50" data-testid="select-destination-home">
                          <SelectValue placeholder={loadingStations ? "Loading..." : "Where to?"} />
                        </SelectTrigger>
                        <SelectContent>
                          {stations?.map(s => (
                            <SelectItem key={`dest-${s.id}`} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full md:w-auto bg-white text-primary hover:bg-gray-100" onClick={handleQuickPlan} data-testid="btn-hero-plan">
                  Plan Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Network Status */}
      <section>
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Network Status
          </h2>
          <span className="flex items-center text-sm font-medium text-green-600">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-950 border-red-200">
            <CardContent className="p-4 text-red-600 dark:text-red-400">
              Failed to load network status.
            </CardContent>
          </Card>
        ) : networkSummary ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border/60 hover:border-primary/30 transition-colors">
              <CardContent className="p-5 flex flex-col justify-center">
                <p className="text-sm text-gray-500 font-medium mb-1">Status</p>
                <p className="text-xl font-bold text-green-600 capitalize">
                  {networkSummary.operationalStatus}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/60 hover:border-primary/30 transition-colors">
              <CardContent className="p-5 flex flex-col justify-center">
                <p className="text-sm text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-primary/70" /> Active Trains
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {networkSummary.activeTrains}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/60 hover:border-primary/30 transition-colors">
              <CardContent className="p-5 flex flex-col justify-center">
                <p className="text-sm text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary/70" /> Stations
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {networkSummary.totalStations}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/60 hover:border-primary/30 transition-colors">
              <CardContent className="p-5 flex flex-col justify-center">
                <p className="text-sm text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary/70" /> Crowd Level
                </p>
                <Badge variant={
                  networkSummary.averageCrowdLevel === 'low' ? 'outline' : 
                  networkSummary.averageCrowdLevel === 'moderate' ? 'secondary' : 'destructive'
                } className="w-fit mt-1 capitalize font-bold">
                  {networkSummary.averageCrowdLevel}
                </Badge>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-all cursor-pointer border-border/60 hover:border-primary/50 group" onClick={() => setLocation("/stations")}>
          <CardContent className="p-6 flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Map className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white group-hover:text-primary transition-colors">Network Map</h3>
              <p className="text-gray-500 text-sm mb-3">Explore all 6 lines and 85 stations of the network.</p>
              <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center">
                View map <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all cursor-pointer border-border/60 hover:border-primary/50 group" onClick={() => setLocation("/saved-trips")}>
          <CardContent className="p-6 flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Train className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white group-hover:text-primary transition-colors">Saved Trips</h3>
              <p className="text-gray-500 text-sm mb-3">Quickly access your frequent routes and commutes.</p>
              <span className="text-primary text-sm font-semibold flex items-center">
                View trips <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
