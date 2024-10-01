document.getElementById("syncButton").addEventListener("click", function () {
  const email = document.getElementById("emailInput").value;
  console.log("sync clicked")
  fetchUserId(email);
});

function fetchUserId(email) {
  const apiUrl = `http://127.0.0.1:8000/users/get-user-id/?email=${encodeURIComponent(email)}`;

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
    console.log("response is very gooood");
    return response.json();
    
    })
    .then((data) => {
      console.log("User ID:", data.user_id);
      const messageDiv = document.getElementById("message");
      if (data.user_id === 0) {
        messageDiv.textContent = "We don't have a record of this email!";
        messageDiv.className = "error"; // Add error class for red text
      } else if (data.user_id === 1) {
        messageDiv.textContent = "Email sync successful";
        messageDiv.className = "success"; // Add success class for green text
        
        chrome.storage.local.set({ user_id: data.user_id }, () => {
            console.log("User ID stored in local storage");
        });

        setTimeout(() => {
          window.close(); // Closes the popup
        }, 3000);
      } else {
        messageDiv.textContent = "Unexpected response";
        messageDiv.className = ""; // Reset class
      }
    })
    .catch((error) => {
      console.error("Error fetching user ID:", error);
    });
}
