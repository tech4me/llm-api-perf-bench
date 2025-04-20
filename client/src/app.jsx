import React, { useState, useEffect } from "react";
import {
  invokeLLM,
  fetchVendors,
  addVendor,
  fetchMetrics,
  deleteVendor,
  deleteMetric,
  deleteVendorMetrics
} from "./api";

// Import our new components
import VendorList from "./components/VendorList";
import PastMeasurements from "./components/PastMeasurements";
import MeasurementSession from "./components/MeasurementSession";
import ApiConfigDialog from "./components/ApiConfigDialog";
import { AuthStatus } from "./components/AuthStatus";
import { useAuth } from "./lib/AuthContext";

// Add global styles
import "./app.css";

function App() {
  const { isAuthenticated } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [pastMeasurements, setPastMeasurements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [apiConfig, setApiConfig] = useState({
    name: "",
    url: "",
    apiKey: "",
    modelName: ""
  });

  // Effect to ensure light mode is always applied
  useEffect(() => {
    // Remove dark class if it exists
    document.documentElement.classList.remove('dark');
  }, []);

  // Fetch vendors and metrics on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const vendorsData = await fetchVendors();
        setVendors(vendorsData);

        if (vendorsData.length > 0) {
          setSelectedVendor(vendorsData[0].id);
        }

        const metricsData = await fetchMetrics();
        setPastMeasurements(metricsData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedVendor) {
      alert("Please select a vendor first");
      return;
    }

    setLoading(true);
    setResponse(""); // Clear previous response
    setMetrics(null); // Clear previous metrics

    try {
      // Pass a callback to update the response in real-time as chunks arrive
      const result = await invokeLLM(prompt, selectedVendor, (streamingText) => {
        setResponse(previousResponse => {
          // Update with the full accumulated text from the stream
          return {
            choices: [{ message: { content: streamingText } }]
          };
        });
      });

      // Final update with complete response and metadata
      setResponse(result.response);

      // Set the latest metrics
      setMetrics(result.metrics);

      // Refresh the metrics list
      const metricsData = await fetchMetrics();
      setPastMeasurements(metricsData);
    } catch (error) {
      console.error("Error calling LLM:", error);
      setResponse("Error: Could not get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfigSave = async () => {
    if (!apiConfig.name || !apiConfig.url || !apiConfig.apiKey || !apiConfig.modelName) {
      return;
    }

    try {
      const newVendor = await addVendor({
        name: apiConfig.name,
        url: apiConfig.url,
        apiKey: apiConfig.apiKey,
        modelName: apiConfig.modelName
      });

      // Refresh vendors list
      const vendorsData = await fetchVendors();
      setVendors(vendorsData);

      // Select the newly added vendor
      setSelectedVendor(newVendor.id);

      setShowModal(false);
      setApiConfig({
        name: "",
        url: "",
        apiKey: "",
        modelName: ""
      });
    } catch (error) {
      console.error("Error saving vendor:", error);
      alert("Failed to save vendor configuration");
    }
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setApiConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteVendor = async (id) => {
    try {
      await deleteVendor(id);

      // Refresh vendors and metrics
      const vendorsData = await fetchVendors();
      setVendors(vendorsData);

      // If the deleted vendor was selected, select another vendor if available
      if (id === selectedVendor) {
        setSelectedVendor(vendorsData.length > 0 ? vendorsData[0].id : null);
      }

      // Refresh metrics data as well
      const metricsData = await fetchMetrics();
      setPastMeasurements(metricsData);
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert("Failed to delete vendor");
    }
  };

  const handleDeleteMetric = async (id) => {
    try {
      await deleteMetric(id);

      // Refresh metrics data
      const metricsData = await fetchMetrics();
      setPastMeasurements(metricsData);
    } catch (error) {
      console.error("Error deleting metric:", error);
      alert("Failed to delete metric");
    }
  };

  const handleDeleteAllMetrics = async (apiVendorId) => {
    try {
      await deleteVendorMetrics(apiVendorId);

      // Refresh metrics data
      const metricsData = await fetchMetrics();
      setPastMeasurements(metricsData);
    } catch (error) {
      console.error("Error deleting all metrics:", error);
      alert("Failed to delete metrics");
    }
  };

  // Get selected vendor details
  const selectedVendorDetails = vendors.find(v => v.id === selectedVendor) || null;

  // Filter measurements for selected vendor
  const filteredMeasurements = selectedVendor
    ? pastMeasurements.filter(m => m.apiVendorId === selectedVendor)
    : [];

  return (
    <div className="app-container bg-background text-foreground">
      <div className="flex justify-between items-center px-6 py-3">
        <h1 className="text-3xl font-bold text-center">LLM API Performance Bench</h1>
        <AuthStatus />
      </div>

      <div className="component-container">
        <div className="component vendor-list bg-card text-card-foreground">
          <VendorList
            vendors={vendors}
            selectedVendor={selectedVendor}
            setSelectedVendor={setSelectedVendor}
            setShowModal={setShowModal}
            onDeleteVendor={handleDeleteVendor}
          />
        </div>

        <div className="component past-measurements bg-card text-card-foreground">
          <PastMeasurements
            selectedVendorDetails={selectedVendorDetails}
            filteredMeasurements={filteredMeasurements}
            onDeleteMetric={handleDeleteMetric}
            onDeleteAllMetrics={handleDeleteAllMetrics}
          />
        </div>

        <div className="component measurement-session bg-card text-card-foreground">
          <MeasurementSession
            selectedVendorDetails={selectedVendorDetails}
            prompt={prompt}
            setPrompt={setPrompt}
            response={response}
            handleSubmit={handleSubmit}
            loading={loading}
            metrics={metrics}
          />
        </div>
      </div>

      <ApiConfigDialog
        showModal={showModal}
        setShowModal={setShowModal}
        apiConfig={apiConfig}
        handleConfigChange={handleConfigChange}
        handleConfigSave={handleConfigSave}
      />
    </div>
  );
}

export default App;
