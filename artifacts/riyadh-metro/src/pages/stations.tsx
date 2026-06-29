import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Map, Train, MapPin, Activity, Info, AlertTriangle } from "lucide-react";
import { useListLines } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function Stations() {
  const [, setLocation] = useLocation();
  const { data: lines, isLoading, error } = useListLines();
  const [activeTab, setActiveTab] = useState<string>("1");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" /> Network Map
        </h1>
        <Skeleton className="h-12 w-full" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !lines) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6 text-center text-red-600">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Failed to load station data.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const activeLineData = lines.find(l => l.number.toString() === activeTab) || lines[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Network Map
        </h1>
        <Button variant="outline" onClick={() => setLocation("/planner")}>
          <Map className="w-4 h-4 mr-2" /> Plan a Trip
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full pb-2">
          <TabsList className="w-full justify-start h-auto p-1 bg-transparent space-x-2">
            {lines.map((line) => (
              <TabsTrigger 
                key={line.id} 
                value={line.number.toString()}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 rounded-full px-4 py-2 border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700 shadow-sm data-[state=active]:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }}></div>
                <span className="font-semibold">Line {line.number}</span>
                <span className="text-xs text-gray-500 hidden sm:inline-block">({line.totalStations})</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {lines.map((line) => (
          <TabsContent key={line.id} value={line.number.toString()} className="mt-6 focus-visible:outline-none">
            <Card className="overflow-hidden border-t-4" style={{ borderTopColor: line.color }}>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 sm:px-6 border-b border-border/50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: line.color }}></div>
                    {line.name} Line
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{line.totalStations} stations • Active status</p>
                </div>
              </div>
              
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {line.stations.map((station, idx) => (
                    <div 
                      key={station.id} 
                      className="group flex items-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer p-4 sm:px-6 relative"
                      onClick={() => setLocation(`/stations/${station.id}`)}
                      data-testid={`station-row-${station.id}`}
                    >
                      {/* Visual Line Element */}
                      <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-1 flex flex-col items-center z-0">
                        {idx !== 0 && <div className="h-1/2 w-full" style={{ backgroundColor: line.color }}></div>}
                        {idx !== line.stations.length - 1 && <div className="h-1/2 w-full mt-auto" style={{ backgroundColor: line.color }}></div>}
                      </div>

                      {/* Station Node */}
                      <div className="relative z-10 w-5 h-5 rounded-full border-4 border-white dark:border-gray-950 shadow-sm mr-6 shrink-0" 
                           style={{ backgroundColor: station.isInterchange ? 'white' : line.color, borderColor: station.isInterchange ? line.color : 'white' }}>
                        {station.isInterchange && <div className="absolute inset-1 rounded-full" style={{ backgroundColor: line.color }}></div>}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                              {station.name}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium" dir="rtl">{station.nameAr}</p>
                          </div>
                          
                          {station.isInterchange && station.interchangeLines && (
                            <div className="flex gap-1.5 shrink-0 flex-wrap">
                              {station.interchangeLines.filter(l => l !== line.id).map(lId => {
                                const iLine = lines.find(l => l.id === lId);
                                if (!iLine) return null;
                                return (
                                  <Badge key={lId} variant="outline" className="text-xs px-2 py-0.5 border" style={{ borderColor: iLine.color, color: iLine.color }}>
                                    L{iLine.number}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
