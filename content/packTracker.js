/**
 * 
 * 
 */

// Retrieve the API URL from chrome.storage.local
chrome.storage.local.get(['apiURL', 'user_id'], function(result) {
    if (chrome.runtime.lastError) {
        console.error('Error retrieving items from chrome.storage.local:', chrome.runtime.lastError);
    } else {
        const apiUrl = result.apiURL;
        const userId = result.user_id || 0; // Default to 0 if user_id is not found

        console.log('Retrieved API URL:', apiUrl);
        console.log('Retrieved User ID:', userId);

        // Store the values in localStorage
        localStorage.setItem('apiUrl', apiUrl);
        localStorage.setItem('userId', userId);

        // Use the API URL and user ID as needed
    }
});



// Create a MutationObserver to watch for changes in the DOM
const observerCallback = (mutationsList, observer) => {
    // Call both functions to handle packs and picks
    addEventListenersToPacks();
    addEventListenersToPicks();
};

// Create a MutationObserver instance
const observer = new MutationObserver(observerCallback);

// Start observing the document body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});