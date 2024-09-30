/**
 * This function is used to send batch data to an API endpoint using POST method
 * @param {Object} batchData - The batch data to send to the backend.
 * @param {string} endpoint - The URL of the backend API endpoint.
 */

async function sendBatchDataToBackend(batchData, endpoint) {
  try {
    const apiURL = await new Promise((resolve, reject) => {
      chrome.storage.local.get(["apiURL"], function (result) {
        if (chrome.runtime.lastError) {
          reject(
            new Error("Error retrieving API URL: " + chrome.runtime.lastError)
          );
          return;
        }

        const apiURL = result.apiURL;
        if (!apiURL) {
          reject(new Error("API URL not found"));
          return;
        }

        console.log("API URL:", apiURL);
        resolve(apiURL); // Resolve the promise with the apiURL
      });
    });

    const url = apiURL + endpoint;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchData),
    });

    const data = await response.json();
    console.log("Batch data successfully sent to the backend:", data);
  } catch (error) {
    console.error("Error sending batch data to the backend:", error);
  }
}
