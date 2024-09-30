document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signOutButton').addEventListener('click', function () {
        // Remove JWT from storage
        chrome.storage.local.remove(['access_token', 'user_id'], function() {
            console.log('User logged out.');
            // Reload the popup to show the login page
            chrome.runtime.reload(); // This will trigger the popup to refresh and load login.html
        });
    });
});
