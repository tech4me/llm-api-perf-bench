import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { PlayCircle, Loader2, BarChart } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Predefined prompts
const PREDEFINED_PROMPTS = [
  { id: "prompt1", label: "QA Prompt", text: "Explain why is it important to measure the performance of LLM APIs?" },
  { id: "prompt2", label: "Chain of Thought Prompt", text: "You have a budget of $100. You spend $30 on backend server and $40 on database server. You then receive $15 credit from the cloud provider. How much money do you have left? Explain each step of your reasoning before providing the final answer." },
  { id: "prompt3", label: "Tree of Thought Prompt", text: "Imagine you are tasked with designing a new website for LLM API Benchmarking. Consider at least three different design approaches, outlining the pros and cons of each, and then choose the best one." },
  { id: "custom", label: "Custom Prompt", text: "" }
];

const MeasurementSession = ({
  selectedVendorDetails,
  prompt,
  setPrompt,
  response,
  handleSubmit,
  loading,
  metrics
}) => {
  const [selectedPromptType, setSelectedPromptType] = useState("custom");

  const handlePromptTypeChange = (value) => {
    setSelectedPromptType(value);
    const selectedPrompt = PREDEFINED_PROMPTS.find(p => p.id === value);
    if (selectedPrompt && value !== "custom") {
      setPrompt(selectedPrompt.text);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Measurement Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedVendorDetails ? (
          <div className="flex items-center justify-center h-[200px] border border-dashed rounded-md">
            <p className="text-muted-foreground text-center">
              Select a vendor first to start a measurement
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <p className="text-sm">Using vendor: </p>
              <Badge variant="outline" className="ml-2">{selectedVendorDetails.name}</Badge>
            </div>
            <div className="flex items-center">
              <p className="text-sm">Model: </p>
              <Badge variant="secondary" className="ml-2">{selectedVendorDetails.modelName}</Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Select a prompt type:</p>
                <Select
                  value={selectedPromptType}
                  onValueChange={handlePromptTypeChange}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a prompt type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_PROMPTS.map((promptOption) => (
                      <SelectItem key={promptOption.id} value={promptOption.id}>
                        {promptOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Enter your prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading || selectedPromptType !== "custom"}
                className={`min-h-[120px] resize-none ${selectedPromptType !== "custom" ? "opacity-70" : ""}`}
              />

              <Button
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Run Measurement
                  </>
                )}
              </Button>
            </div>

            {/* Latest Measurement Results Section */}
            {metrics && (
              <div className="p-4 bg-accent rounded-md mt-4 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-base flex items-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    Latest Measurement Results
                  </div>
                  <Badge variant="outline">{formatTimestamp(metrics.timestamp)}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-background p-3 rounded-md">
                    <p className="font-medium text-primary">Response Time</p>
                    <p className="text-lg font-bold">{(metrics.responseTime / 1000).toFixed(2)}s</p>
                  </div>
                  <div className="bg-background p-3 rounded-md">
                    <p className="font-medium text-primary">Time to First Token</p>
                    <p className="text-lg font-bold">{(metrics.timeToFirstToken / 1000).toFixed(2)}s</p>
                  </div>
                  <div className="bg-background p-3 rounded-md">
                    <p className="font-medium text-primary">Tokens Per Second</p>
                    <p className="text-lg font-bold">{metrics.tokensPerSecond.toFixed(2)}</p>
                  </div>
                  <div className="bg-background p-3 rounded-md">
                    <p className="font-medium text-primary">Token Count</p>
                    <p className="text-lg font-bold">{metrics.tokenCount}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-accent rounded-md mt-4">
              <div className="font-medium text-sm mb-2">Response:</div>
              <div className="text-sm whitespace-pre-wrap">
                {response ? (
                  <p>{typeof response === 'string'
                    ? response
                    : response.choices?.[0]?.message?.content ||
                    response.choices?.[0]?.delta?.content ||
                    'No content found in response'}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Response will appear here</p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MeasurementSession; 