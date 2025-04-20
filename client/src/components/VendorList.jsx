import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "./ui/card";
import { Button } from "./ui/button";
import { PlusCircle, Trash } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

const VendorList = ({ 
  vendors, 
  selectedVendor, 
  setSelectedVendor, 
  setShowModal,
  onDeleteVendor
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl">API Vendors</CardTitle>
        <Button 
          onClick={() => setShowModal(true)} 
          size="sm" 
          className="h-8"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </CardHeader>
      <CardContent>
        {vendors.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] border border-dashed rounded-md">
            <p className="text-muted-foreground text-center">
              No vendors configured. <br /> 
              Add one to start.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[70vh]">
            <div className="space-y-2">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors hover:bg-accent relative ${
                    selectedVendor === vendor.id ? "bg-accent border-primary/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="font-medium flex-1"
                      onClick={() => setSelectedVendor(vendor.id)}
                    >{vendor.name}</div>
                    <div className="flex items-center space-x-2">
                      {selectedVendor === vendor.id && (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </div>
                  </div>
                  <div 
                    className="text-xs text-muted-foreground truncate mt-1"
                    onClick={() => setSelectedVendor(vendor.id)}
                  >
                    {vendor.url}
                  </div>
                  <div 
                    className="text-xs text-muted-foreground mt-1 flex items-center"
                    onClick={() => setSelectedVendor(vendor.id)}
                  >
                    <span className="font-medium">Model:</span> {vendor.modelName}
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
                          onDeleteVendor(vendor.id);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorList; 