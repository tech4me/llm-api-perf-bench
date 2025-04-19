// API functions for LLM Measurement Tool

// Base API URL
const API_URL = 'http://localhost:3000';

// Common fetch options
const fetchOptions = {
  credentials: 'include', // Include credentials for authentication
};

// Fetch all API vendors
export const fetchVendors = async () => {
  try {
    const response = await fetch(`${API_URL}/api/vendors`, fetchOptions);
    if (!response.ok) {
      throw new Error('Failed to fetch vendors');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
};

// Add a new API vendor
export const addVendor = async (vendor) => {
  try {
    const response = await fetch(`${API_URL}/api/vendors`, {
      ...fetchOptions,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor),
    });
    if (!response.ok) {
      throw new Error('Failed to add vendor');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding vendor:', error);
    throw error;
  }
};

// Delete an API vendor
export const deleteVendor = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/vendors/${id}`, {
      ...fetchOptions,
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete vendor');
    }
    return true;
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
};

// Fetch all performance metrics
export const fetchMetrics = async () => {
  try {
    const response = await fetch(`${API_URL}/api/metrics`, fetchOptions);
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
};

// Delete a specific metric
export const deleteMetric = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/metrics/${id}`, {
      ...fetchOptions,
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete metric');
    }
    return true;
  } catch (error) {
    console.error('Error deleting metric:', error);
    throw error;
  }
};

// Delete all metrics for a specific vendor
export const deleteVendorMetrics = async (apiVendorId) => {
  try {
    const response = await fetch(`${API_URL}/api/vendors/${apiVendorId}/metrics`, {
      ...fetchOptions,
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete vendor metrics');
    }
    return true;
  } catch (error) {
    console.error('Error deleting vendor metrics:', error);
    throw error;
  }
};

// Process a chunk of text from an LLM stream
const processStreamChunk = (chunk) => {
  let extractedText = '';
  
  try {
    // Different APIs format their streaming responses differently
    // Handle OpenAI-like format with "data: " prefix
    const lines = chunk.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      // Skip non-data lines
      if (!line.startsWith('data: ')) continue;
      
      const jsonStr = line.replace('data: ', '').trim();
      if (jsonStr === '[DONE]') continue;
      
      try {
        const parsedChunk = JSON.parse(jsonStr);
        const content = parsedChunk.choices?.[0]?.delta?.content || 
                        parsedChunk.choices?.[0]?.message?.content || '';
        
        if (content) {
          extractedText += content;
        }
      } catch (e) {
        // If JSON parsing fails for this line, just continue to the next line
        console.warn('Failed to parse JSON in stream chunk:', e);
      }
    }
  } catch (e) {
    console.warn('Error processing stream chunk:', e);
  }
  
  return extractedText;
};

// Invoke LLM API with selected vendor
export const invokeLLM = async (prompt, apiVendorId, onChunk = null) => {
  try {
    // Fetch vendor details to get API URL and key
    const vendors = await fetchVendors();
    const vendor = vendors.find(v => v.id === apiVendorId);
    
    if (!vendor) {
      throw new Error('Vendor not found');
    }
    
    // Record start time
    const startTime = new Date();
    let timeToFirstToken = null;
    let accumulatedText = '';
    
    // Invoke the vendor's API directly using their URL and key
    // Request streaming response
    const response = await fetch(vendor.url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${vendor.apiKey}`
      },
      body: JSON.stringify({ 
        model: vendor.modelName, 
        messages: [{role: "user", content: prompt}],
        stream: true  // Enable streaming
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch response from LLM provider');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let receivedFirstToken = false;
    let rawResponse = '';
    let buffer = ''; // Buffer to hold incomplete chunks
    
    // Process the stream
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) break;
      
      // Record time to first token when we get the first chunk
      if (!receivedFirstToken) {
        timeToFirstToken = new Date() - startTime;
        receivedFirstToken = true;
      }
      
      // Decode this chunk and add to our buffer
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      rawResponse += chunk;

      // Split by newlines but keep any partial line in the buffer
      let lines = buffer.split('\n');
      
      // The last line might be incomplete, save it back to the buffer
      buffer = lines.pop() || '';
      
      // Process complete lines
      if (lines.length > 0) {
        const completeChunk = lines.join('\n');
        const extractedText = processStreamChunk(completeChunk);
        
        if (extractedText) {
          accumulatedText += extractedText;
          
          // Call the callback with the updated text if provided
          if (onChunk) {
            onChunk(accumulatedText);
          }
        }
      }
    }
    
    // Process any remaining text in the buffer
    if (buffer) {
      const extractedText = processStreamChunk(buffer);
      if (extractedText) {
        accumulatedText += extractedText;
        if (onChunk) {
          onChunk(accumulatedText);
        }
      }
    }
    
    // Record end time and calculate total generation time
    const endTime = new Date();
    const totalTime = endTime - startTime;
    
    // If we didn't get any accumulated text from streaming, try to parse it from the full response
    if (!accumulatedText) {
      console.warn('No text accumulated during streaming, attempting to parse from full response');
      accumulatedText = processStreamChunk(rawResponse);
    }
    
    // Create response data structure
    const responseData = { 
      choices: [{ 
        message: { content: accumulatedText }
      }]
    };
    
    // Extract token count from the usage field if available, otherwise estimate
    let tokenCount;
    try {
      // Try to extract usage information from the raw response
      const usageMatch = rawResponse.match(/"usage":\s*({[^}]+})/);
      if (usageMatch && usageMatch[1]) {
        const usage = JSON.parse(usageMatch[1]);
        tokenCount = usage.completion_tokens || usage.total_tokens;
      }
    } catch (e) {
      console.warn('Error extracting token count from usage field:', e);
    }
    
    // Fall back to estimation if we couldn't get actual token count
    if (!tokenCount) {
      tokenCount = Math.ceil(accumulatedText.length / 4);
    }
    
    // Calculate tokens per second
    const tokensPerSecond = tokenCount > 0 ? tokenCount / (totalTime / 1000) : 0;
    
    // Record the metrics
    const metrics = {
      apiVendorId,
      prompt,
      responseTime: totalTime,
      timeToFirstToken: timeToFirstToken || 0,
      tokenCount,
      tokensPerSecond,
      timestamp: endTime,
      responseData
    };
    
    // Send metrics to our server
    await fetch(`${API_URL}/api/metrics`, {
      ...fetchOptions,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics),
    });
    
    return {
      response: responseData,
      metrics
    };
  } catch (error) {
    console.error('Error calling LLM:', error);
    return { 
      response: 'Error: Could not get a response. Please try again.',
      metrics: null
    };
  }
}; 