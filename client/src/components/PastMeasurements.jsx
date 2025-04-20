import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "./ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "./ui/tooltip";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PastMeasurements = ({ 
  selectedVendorDetails, 
  filteredMeasurements,
  onDeleteMetric,
  onDeleteAllMetrics
}) => {
  // Calculate averages for metrics
  const calculateAverages = () => {
    if (!filteredMeasurements || filteredMeasurements.length === 0) {
      return { avgTimeToFirstToken: 0, avgTokensPerSecond: 0 };
    }
    
    let totalTimeToFirstToken = 0;
    let totalTokensPerSecond = 0;
    let ttftCount = 0;
    let tpsCount = 0;
    
    filteredMeasurements.forEach(measurement => {
      if (measurement.timeToFirstToken) {
        totalTimeToFirstToken += measurement.timeToFirstToken;
        ttftCount++;
      }
      if (measurement.tokensPerSecond) {
        totalTokensPerSecond += measurement.tokensPerSecond;
        tpsCount++;
      }
    });
    
    return {
      avgTimeToFirstToken: ttftCount > 0 ? totalTimeToFirstToken / ttftCount : 0,
      avgTokensPerSecond: tpsCount > 0 ? totalTokensPerSecond / tpsCount : 0
    };
  };
  
  const { avgTimeToFirstToken, avgTokensPerSecond } = calculateAverages();
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl">Past Measurements</CardTitle>
        {selectedVendorDetails && filteredMeasurements.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => {
              if (window.confirm(`Delete all measurements for ${selectedVendorDetails.name}?`)) {
                onDeleteAllMetrics(selectedVendorDetails.id);
              }
            }}
          >
            <Trash className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!selectedVendorDetails ? (
          <div className="flex items-center justify-center h-[200px] border border-dashed rounded-md">
            <p className="text-muted-foreground text-center">
              Select a vendor to see past measurements
            </p>
          </div>
        ) : filteredMeasurements.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] border border-dashed rounded-md">
            <p className="text-muted-foreground text-center">
              No measurements with this vendor yet
            </p>
          </div>
        ) : (
          <>
            {/* Average summary */}
            <div className="mb-4 p-3 rounded-md bg-primary/5 border">
              <h3 className="text-sm font-semibold mb-2">Average for {selectedVendorDetails.name} - {selectedVendorDetails.modelName}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Avg. Time to First Token</p>
                  <p className="text-lg font-medium">{avgTimeToFirstToken.toFixed(0)}ms</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg. Tokens per Second</p>
                  <p className="text-lg font-medium">{avgTokensPerSecond.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <ScrollArea className="h-[70vh]">
              <div className="space-y-3">
                {filteredMeasurements.map((measurement) => (
                  <TooltipProvider key={measurement.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="border p-3 rounded-md bg-card hover:bg-accent/50 transition-colors relative">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(measurement.createdAt), { addSuffix: true })}
                            </div>
                            <div className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                              {selectedVendorDetails.name}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">Model:</span> {selectedVendorDetails.modelName}
                          </div>
                          <div className="font-medium text-sm mt-2">
                            <span className="text-muted-foreground">Time to First Token:</span> {measurement.timeToFirstToken ? `${measurement.timeToFirstToken.toFixed(0)}ms` : 'N/A'}
                          </div>
                          <div className="mt-2 p-2 bg-accent/50 rounded-md text-sm">
                            <span className="text-muted-foreground">Tokens per Second:</span> {measurement.tokensPerSecond ? `${measurement.tokensPerSecond.toFixed(2)}` : 'N/A'}
                          </div>
                          <div className="flex items-center justify-end mt-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-destructive hover:bg-destructive/10 ml-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Delete this measurement?')) {
                                  onDeleteMetric(measurement.id);
                                }
                              }}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{new Date(measurement.createdAt).toLocaleString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PastMeasurements; 