/**
 * This function is used to send batch data to an API end point using POST method
 * @param {Object} batchData - The batch data to send to the backend.
 * @param {string} endpoint - The URL of the backend API endpoint.
 */

function sendBatchDataToBackend(batchData, endpoint) {

    const apiUrl = localStorage.getItem('apiUrl');
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
    });
}


function retrieveUserId() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['user_id'], function(result) {
            if (chrome.runtime.lastError) {
                console.error('Error retrieving user ID:', chrome.runtime.lastError);
                resolve(0); // Resolve with default value in case of error
            } else {
                // Resolve with the user_id or default value
                resolve(result.user_id || 0);
            }
        });
    });
}