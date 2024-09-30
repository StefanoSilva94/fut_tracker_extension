document.addEventListener('DOMContentLoaded', function() {
    console.log("Starting popup.js")
    // Retrieve both the access_token and apiURL from chrome.storage.local
    chrome.storage.local.get(['access_token', 'apiURL'], function(items) {
        const access_token = items.access_token;
        const apiURL = items.apiURL;
        console.log("retrieved apiURL and acceess_token from popup.js")

        if (!access_token) {
            loadLogin();
        } else {
            // Token exists, verify it
            fetch(`${apiURL}/login/verify-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    access_token: access_token,
                    token_type: 'bearer' // Adjust if your token_type is different
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.is_valid) {
                    loadLogout();
                }
                else {
                    loadLogin();
                }


            
        }
    );
}
});
});



function loadLogin() {
    fetch('login.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            // Dispatch a custom event to notify that the login view is loaded
            document.dispatchEvent(new Event('showLogin'));
        })
        .catch(error => console.error('Error loading login form:', error));
}


function loadLogout() {
  fetch("logout.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
      // Dispatch a custom event to notify that the logout view is loaded
      document.dispatchEvent(new Event("showLogout"));

      // Add event listener for the logout button
      document
        .getElementById("signOutButton")
        .addEventListener("click", handleLogout);
    })
    .catch((error) => console.error("Error loading logout form:", error));
}

function handleLogout() {
  chrome.storage.local.remove(["access_token", "user_id"], function () {
    console.log("Access token and user ID removed from local storage.");
    // Optionally, update the popup to reflect the logged-out state
    updatePopup();
    loadLogin();
  });
}


// Function to update the popup based on the presence of access_token
function updatePopup() {
    chrome.storage.local.get(['access_token'], function(items) {
        const accessToken = items.access_token;

        if (accessToken) {
            // If access_token exists, set popup to logout.html
            chrome.action.setPopup({ popup: 'login/logout.html' }); // Updated path
            console.log('Popup set to login/logout.html');
        } else {
            // If access_token does not exist, set popup to login.html
            chrome.action.setPopup({ popup: 'login/login.html' }); // Updated path
            console.log('Popup set to login/login.html');
        }
    });
}

// Initial check when the background script is loaded
updatePopup();

// Optional: Monitor changes to the storage
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && 'access_token' in changes) {
        console.log("changes found")
        updatePopup();
    }
});