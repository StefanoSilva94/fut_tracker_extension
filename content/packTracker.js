// Function to call the FastAPI endpoint on page refresh
function fetchUserId(email) {
  const apiUrl = "http://127.0.0.1:8000/users/get-user-id/?email=test@gmail.com";

  fetch(apiUrl, {
    method: "POST", // Use POST method
    headers: {
      "Content-Type": "application/json", // Specify content type
    },
    // body: JSON.stringify({ email: email }), // Send email as JSON body
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("response is gooood")
      return response.json();
    })
    .then((data) => {
      console.log("User ID:", data.user_id); // Handle the user ID returned from the API
    })
    .catch((error) => {
      console.error("Error fetching user ID:", error);
    });
}

// Call the function when the window loads
window.onload = function () {
  const userEmail = "test@gmail.com"; // Replace with the user's email as needed
  fetchUserId(userEmail);
};

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
  subtree: true,
});
