/**
 * This function is used to send batch data to an API end point using POST method
 * @param {Object} batchData - The batch data to send to the backend.
 * @param {string} endpoint - The URL of the backend API endpoint.
 */

function sendBatchDataToBackend(batchData, endpoint) { 
    const apiUrl = "https://api.fut-tracker.co.uk";
    const url = apiUrl + endpoint;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Batch data successfully sent to the backend:', data);
    })
    .catch((error) => {
        console.error('Error sending batch data to the backend:', error);
        console.log("API URL: ", apiUrl);
    });
}