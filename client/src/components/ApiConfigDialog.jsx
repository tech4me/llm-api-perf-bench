import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const ApiConfigDialog = ({
  showModal,
  setShowModal,
  apiConfig,
  handleConfigChange,
  handleConfigSave,
}) => {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>LLM API Configuration</DialogTitle>
          <DialogDescription>
            Configure your Large Language Model API settings below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Vendor Name
            </Label>
            <Input
              id="name"
              name="name"
              value={apiConfig.name}
              onChange={handleConfigChange}
              placeholder="e.g., OpenAI, Anthropic"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              API URL
            </Label>
            <Input
              id="url"
              name="url"
              value={apiConfig.url}
              onChange={handleConfigChange}
              placeholder="e.g., https://api.openai.com/v1/chat/completions"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              name="apiKey"
              type="password"
              value={apiConfig.apiKey}
              onChange={handleConfigChange}
              placeholder="Enter your API key"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelName" className="text-right">
              Model Name
            </Label>
            <Input
              id="modelName"
              name="modelName"
              value={apiConfig.modelName}
              onChange={handleConfigChange}
              placeholder="e.g., gpt-4, claude-3-sonnet"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfigSave}
            disabled={!apiConfig.name || !apiConfig.url || !apiConfig.apiKey || !apiConfig.modelName}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiConfigDialog; 