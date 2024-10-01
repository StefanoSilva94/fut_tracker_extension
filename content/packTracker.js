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