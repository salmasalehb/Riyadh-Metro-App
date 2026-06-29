import { useLocation } from "wouter";
import { ArrowLeft, Clock, Users, Coffee, Wifi, Activity, MapPin, AlertCircle, ShoppingBag } from "lucide-react";
import { useGetStation } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function StationDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const { data: station, isLoading, error } = useGetStation(params.id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" disabled className="w-fit"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setLocation("/stations")} className="w-fit"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Map</Button>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-12 text-center text-red-600 flex flex-col items-center">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">Station not found or could not be loaded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <Button variant="ghost" onClick={() => setLocation("/stations")} className="mb-2 w-fit hover:bg-gray-100" data-testid="btn-back">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Map
      </Button>

      {/* Header Card */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gray-900 text-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-2" style={{ backgroundColor: station.lineColor }}></div>
        
        <CardContent className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge className="px-3 py-1 font-bold text-sm bg-white/20 hover:bg-white/30 text-white border-0">
                Line {station.lineNumber}
              </Badge>
              {station.isInterchange && (
                <Badge variant="outline" className="px-3 py-1 text-sm bg-black/40 border-white/20 text-white">
                  Interchange
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{station.name}</h1>
            <p className="text-2xl text-gray-300 font-medium font-sans" dir="rtl">{station.nameAr}</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100" onClick={() => setLocation(`/planner?origin=${station.id}`)} data-testid="btn-plan-from">
              Start Here
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => setLocation(`/planner?destination=${station.id}`)} data-testid="btn-plan-to">
              End Here
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content - 2 columns wide */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Live Departures
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {station.nextTrains && station.nextTrains.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {station.nextTrains.map((train, i) => (
                    <div key={i} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <div>
                        <p className="font-bold text-lg">{train.direction}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <Activity className="w-3 h-3 text-green-500" /> On time
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl text-primary flex items-baseline gap-1">
                          {train.minutesUntil === 0 ? "Now" : train.minutesUntil}
                          {train.minutesUntil > 0 && <span className="text-sm font-medium text-gray-500">min</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No upcoming trains available.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column wide */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Crowd Level</p>
                  <Badge variant={
                    station.crowdLevel === 'low' ? 'outline' : 
                    station.crowdLevel === 'moderate' ? 'secondary' : 'destructive'
                  } className="capitalize text-sm px-3 py-1 w-full justify-center">
                    {station.crowdLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Coffee className="w-5 h-5 text-primary" /> Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {station.amenities && station.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {station.amenities.map(amenity => {
                    const am = amenity.toLowerCase();
                    let Icon = MapPin;
                    if (am.includes('wifi')) Icon = Wifi;
                    if (am.includes('coffee') || am.includes('cafe')) Icon = Coffee;
                    if (am.includes('shop') || am.includes('retail')) Icon = ShoppingBag;
                    
                    return (
                      <Badge key={amenity} variant="secondary" className="px-3 py-1 font-normal flex items-center gap-1.5">
                        <Icon className="w-3 h-3 opacity-70" />
                        {amenity}
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Standard amenities available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
