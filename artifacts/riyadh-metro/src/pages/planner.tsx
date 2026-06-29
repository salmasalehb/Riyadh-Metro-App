import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { 
  Map, MapPin, Search, ArrowRight, ArrowDown, Clock, 
  CreditCard, Users, BookmarkPlus, Navigation, ChevronDown, CheckCircle2 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useListStations, usePlanTrip, useSaveTrip } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function Planner() {
  const [locationStr] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialOrigin = searchParams.get("origin") || "";
  const initialDestination = searchParams.get("destination") || "";

  const { isAuthenticated } = useAuth();
  
  const [originId, setOriginId] = useState(initialOrigin);
  const [destinationId, setDestinationId] = useState(initialDestination);
  const [preferFewer, setPreferFewer] = useState(false);

  const { data: stations, isLoading: loadingStations } = useListStations();
  const planTripMutation = usePlanTrip();
  const saveTripMutation = useSaveTrip();

  const handlePlanTrip = () => {
    if (!originId || !destinationId) {
      toast.error("Please select both origin and destination stations.");
      return;
    }
    if (originId === destinationId) {
      toast.error("Origin and destination cannot be the same.");
      return;
    }

    planTripMutation.mutate({
      data: { originId, destinationId, preferFewer }
    });
  };

  const handleSaveTrip = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to save trips.");
      return;
    }
    
    if (!planTripMutation.data) return;
    
    const trip = planTripMutation.data;
    
    try {
      await saveTripMutation.mutateAsync({
        data: {
          originId: trip.origin.id,
          destinationId: trip.destination.id,
          originName: trip.origin.name,
          destinationName: trip.destination.name
        }
      });
      toast.success("Trip saved successfully!");
    } catch (err) {
      toast.error("Failed to save trip.");
    }
  };

  const swapStations = () => {
    setOriginId(destinationId);
    setDestinationId(originId);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Map className="w-6 h-6 text-primary" />
        Trip Planner
      </h1>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-4 w-full relative">
              <div className="relative">
                <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">From</label>
                <div className="flex items-center">
                  <div className="w-8 flex justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full border-2 border-primary"></div>
                  </div>
                  <Select value={originId} onValueChange={setOriginId}>
                    <SelectTrigger className="w-full" data-testid="select-origin">
                      <SelectValue placeholder={loadingStations ? "Loading..." : "Select origin station"} />
                    </SelectTrigger>
                    <SelectContent>
                      {stations?.map(s => (
                        <SelectItem key={`orig-${s.id}`} value={s.id}>
                          {s.name} <span className="text-gray-400 text-sm ml-1">({s.lineName})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="absolute left-[15px] top-[3.5rem] bottom-[2.5rem] w-0.5 bg-gray-200 dark:bg-gray-800 -z-10 hidden md:block"></div>
              
              <div className="relative">
                <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">To</label>
                <div className="flex items-center">
                  <div className="w-8 flex justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <Select value={destinationId} onValueChange={setDestinationId}>
                    <SelectTrigger className="w-full" data-testid="select-destination">
                      <SelectValue placeholder={loadingStations ? "Loading..." : "Select destination station"} />
                    </SelectTrigger>
                    <SelectContent>
                      {stations?.map(s => (
                        <SelectItem key={`dest-${s.id}`} value={s.id}>
                          {s.name} <span className="text-gray-400 text-sm ml-1">({s.lineName})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center shrink-0 h-[104px] pb-[14px]">
              <Button variant="ghost" size="icon" onClick={swapStations} className="rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700" title="Swap stations">
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-full md:w-auto shrink-0 flex flex-col gap-3">
              <div className="flex items-center space-x-2 pt-2 md:pt-0 pb-1">
                <Checkbox id="prefer-fewer" checked={preferFewer} onCheckedChange={(checked) => setPreferFewer(checked as boolean)} />
                <label htmlFor="prefer-fewer" className="text-sm font-medium leading-none cursor-pointer">
                  Prefer fewer transfers
                </label>
              </div>
              <Button size="lg" className="w-full md:w-32" onClick={handlePlanTrip} disabled={planTripMutation.isPending || loadingStations} data-testid="btn-plan-trip">
                {planTripMutation.isPending ? "Planning..." : "Search"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {planTripMutation.isError && (
        <Card className="bg-red-50 dark:bg-red-950/30 border-red-200">
          <CardContent className="p-4 text-red-600 dark:text-red-400 font-medium">
            Could not calculate route. Please try different stations.
          </CardContent>
        </Card>
      )}

      {planTripMutation.isPending && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      )}

      {planTripMutation.isSuccess && planTripMutation.data && (
        <Card className="overflow-hidden border-border/50 shadow-md">
          <div className="bg-primary/5 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border/50">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-lg font-bold text-gray-900 dark:text-white">
                <Clock className="w-5 h-5 text-primary" />
                {planTripMutation.data.totalDuration} min
              </div>
              <div className="flex items-center gap-1.5 text-lg font-bold text-gray-900 dark:text-white">
                <CreditCard className="w-5 h-5 text-primary" />
                {planTripMutation.data.fare} SAR
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={
                planTripMutation.data.crowdLevel === 'low' ? 'outline' : 
                planTripMutation.data.crowdLevel === 'moderate' ? 'secondary' : 'destructive'
              } className="capitalize flex items-center gap-1">
                <Users className="w-3 h-3" />
                {planTripMutation.data.crowdLevel} crowding
              </Badge>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-auto" 
                onClick={handleSaveTrip}
                disabled={saveTripMutation.isPending || saveTripMutation.isSuccess}
                data-testid="btn-save-trip"
              >
                {saveTripMutation.isSuccess ? (
                  <><CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Saved</>
                ) : (
                  <><BookmarkPlus className="w-4 h-4 mr-2" /> Save Trip</>
                )}
              </Button>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800 before:hidden">
              
              {planTripMutation.data.steps.map((step, idx, arr) => (
                <div key={idx} className="relative">
                  {/* Line connecting nodes */}
                  {idx < arr.length - 1 && (
                    <div 
                      className="absolute left-[11px] top-6 bottom-[-32px] w-1.5 -translate-x-1/2 z-0 rounded-full" 
                      style={{ backgroundColor: step.lineColor }}
                    ></div>
                  )}
                  
                  {/* Origin Node for this step */}
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className="w-6 h-6 rounded-full border-4 border-white dark:border-gray-950 z-10 flex-shrink-0 mt-0.5 shadow-sm"
                      style={{ backgroundColor: step.lineColor }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                        {step.boardAt}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" style={{ backgroundColor: `${step.lineColor}15`, color: step.lineColor, borderColor: `${step.lineColor}30` }}>
                          Line {step.lineNumber} - {step.lineName}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Travel Info */}
                  <div className="pl-10 py-2 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      {step.stops} stops
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {step.duration} min
                    </div>
                  </div>

                  {/* Destination Node for this step (only show if it's the last step, otherwise the next step's origin covers it) */}
                  {idx === arr.length - 1 && (
                    <div className="flex items-start gap-4 mt-4">
                      <div 
                        className="w-6 h-6 rounded-full border-4 border-white dark:border-gray-950 z-10 flex-shrink-0 mt-0.5 shadow-sm bg-white dark:bg-gray-900"
                        style={{ borderColor: step.lineColor }}
                      >
                        <div className="w-full h-full rounded-full" style={{ backgroundColor: step.lineColor, transform: 'scale(0.5)' }}></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                          {step.alightAt}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Arrive at destination</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Interchange indication */}
                  {idx < arr.length - 1 && (
                    <div className="flex items-start gap-4 mt-4 relative z-10">
                      <div className="w-6 h-6 rounded-full border-4 border-white dark:border-gray-950 bg-gray-300 dark:bg-gray-700 flex-shrink-0 mt-0.5 shadow-sm"></div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                          {step.alightAt}
                        </div>
                        <div className="text-sm font-medium text-primary mt-1 flex items-center gap-1">
                          <ChevronDown className="w-4 h-4" /> Transfer
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {planTripMutation.data.note && (
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-600 dark:text-gray-400 italic text-center">
                {planTripMutation.data.note}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
