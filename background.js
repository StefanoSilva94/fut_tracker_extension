chrome.runtime.onInstalled.addListener(() => {
    console.log('EAFC Pack Tracker extension installed');
});

// Define the API URL based on the extension's installation type
chrome.management.get(chrome.runtime.id, function(extensionInfo) {
    let apiUrl;

    if (extensionInfo.installType === 'development') {
        // apiUrl = 'http://localhost:8000';
        apiUrl = "https://api.fut-tracker.co.uk";
    } else {
        apiUrl = "https://api.fut-tracker.co.uk";
    }

    // Store the API URL in chrome.storage.local
    chrome.storage.local.set({ "apiURL": apiUrl }, function() {
        if (chrome.runtime.lastError) {
            console.error('Error setting API URL:', chrome.runtime.lastError);
        } else {
            console.log('API URL is set: ', apiUrl);
        }
    });
});


// Function to update the popup based on the presence and validity of access_token
function updatePopup() {
    // Get both apiURL and access_token from storage
    chrome.storage.local.get(['access_token', 'apiURL'], function(items) {
        const accessToken = items.access_token;
        const apiURL = items.apiURL;

        if (accessToken && apiURL) {
            // If access_token and apiURL exist, verify the token
            verifyToken(apiURL, accessToken)
                .then(isValid => {
                    if (isValid) {
                        // Token is valid, set popup to logout.html
                        chrome.action.setPopup({ popup: 'login/logout.html' }); // Path for popup
                        console.log('Popup set to login/logout.html');
                    } else {
                        // Token is not valid, remove it and set popup to login.html
                        chrome.storage.local.remove(['access_token'], function() {
                            console.log('Access token removed due to invalidity.');
                            chrome.action.setPopup({ popup: 'login/login.html' }); // Path for popup
                            console.log('Popup set to login/login.html');
                        });
                    }
                })
                .catch(error => {
                    console.error('Error verifying token:', error);
                    // Handle errors (e.g., remove token and set to login)
                    chrome.storage.local.remove(['access_token'], function() {
                        console.log('Access token removed due to verification error.');
                        chrome.action.setPopup({ popup: 'login/login.html' }); // Path for popup
                        console.log('Popup set to login/login.html');
                    });
                });
        } else {
            // No access_token or apiURL, set popup to login.html
            chrome.action.setPopup({ popup: 'login/login.html' }); // Path for popup
            console.log('Popup set to login/login.html');
        }
    });
}

// Function to verify the access_token via API call
function verifyToken(apiURL, token) {
    return fetch(`${apiURL}/login/verify-token`, { // Using apiURL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            access_token: token,
            token_type: 'bearer', // Adjust if your token_type is different
            user_id: 0
        })
    })
    .then(response => response.json())
    .then(data => data.is_valid)
    .catch(error => {
        console.error('Error during token verification:', error);
        throw error; // Re-throw to handle in updatePopup()
    });
}

// Initial check when the background script is loaded
updatePopup();

// Optional: Monitor changes to the storage
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && ('access_token' in changes || 'apiURL' in changes)) {
        updatePopup();
    }
});



