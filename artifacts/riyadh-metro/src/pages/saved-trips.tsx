import { useState } from "react";
import { useLocation } from "wouter";
import { Map, AlertCircle, Train, Check, Bookmark, ArrowRight, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useListSavedTrips, useDeleteSavedTrip, getListSavedTripsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function SavedTrips() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: savedTrips, isLoading, error } = useListSavedTrips();
  const deleteTripMutation = useDeleteSavedTrip();

  const handleDelete = async (id: string) => {
    try {
      await deleteTripMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListSavedTripsQueryKey() });
      toast.success("Trip removed from saved");
    } catch (err) {
      toast.error("Failed to remove trip");
    }
  };

  const handlePlanTrip = (originId: string, destinationId: string) => {
    setLocation(`/planner?origin=${originId}&destination=${destinationId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-primary" />
          Saved Trips
        </h1>
        <Button onClick={() => setLocation("/planner")} data-testid="btn-plan-new">
          Plan New
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="bg-red-50 dark:bg-red-950 border-red-200">
          <CardContent className="p-6 text-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Failed to load saved trips.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      ) : savedTrips && savedTrips.length > 0 ? (
        <div className="grid gap-4">
          {savedTrips.map((trip) => (
            <Card key={trip.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Map className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-medium text-lg">
                        <span>{trip.originName}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span>{trip.destinationName}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Saved on {new Date(trip.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:self-auto self-end">
                    <Button 
                      variant="outline" 
                      onClick={() => handlePlanTrip(trip.originId, trip.destinationId)}
                      data-testid={`btn-plan-${trip.id}`}
                    >
                      Plan
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(trip.id)}
                      disabled={deleteTripMutation.isPending}
                      data-testid={`btn-delete-${trip.id}`}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No saved trips yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              When you plan a journey, you can save it here for quick access later.
            </p>
            <Button onClick={() => setLocation("/planner")}>
              Plan a Trip Now
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
