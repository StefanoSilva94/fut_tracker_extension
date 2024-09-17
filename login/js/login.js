document.addEventListener('DOMContentLoaded', function () {
  console.log("starting login test");

  // Add event listener for when user clicks submit
  const loginForm = document.querySelector('form');
  const messageDiv = document.createElement('div');
  const additionalMessageDiv = document.createElement('div');
  loginForm.parentElement.appendChild(messageDiv);
  loginForm.parentElement.appendChild(additionalMessageDiv);

  loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      chrome.storage.local.get(['apiURL'], async function (result) {
          if (chrome.runtime.lastError) {
              console.error('Error retrieving API URL:', chrome.runtime.lastError);
              messageDiv.innerText = 'Error retrieving API URL';
              messageDiv.style.backgroundColor = 'lightcoral'; // Red background for errors
              messageDiv.style.color = 'white'; // White text color
              messageDiv.style.padding = '10px';
              messageDiv.style.borderRadius = '5px';
              messageDiv.style.textAlign = 'center';
              additionalMessageDiv.innerText = '';
              return;
          }

          const apiUrl = result.apiURL;

          if (!apiUrl) {
              console.error('API URL not found in chrome.storage.local');
              messageDiv.innerText = 'API URL not found';
              messageDiv.style.backgroundColor = 'lightcoral'; // Red background for errors
              messageDiv.style.color = 'white'; // White text color
              messageDiv.style.padding = '10px';
              messageDiv.style.borderRadius = '5px';
              messageDiv.style.textAlign = 'center';
              additionalMessageDiv.innerText = '';
              return;
          }

          console.log('Retrieved API URL:', apiUrl);
          const email = loginForm.querySelector('input[type="email"]').value;
          const password = loginForm.querySelector('input[type="password"]').value;
          const loginUrl = `${apiUrl}/login`;

          console.log('here is the login api: ', loginUrl);

          try {
              const response = await fetch(loginUrl, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: new URLSearchParams({
                      username: email,
                      password: password
                  })
              });

              const data = await response.json();

              if (!response.ok) {
                  throw new Error('Invalid credentials');
              }

              console.log('Access Token is this:', data.access_token);
              console.log('User ID:', data.user_id);

              // Store data in chrome.storage.local
              await chrome.storage.local.set({
                  'access_token': data.access_token,
                  'user_id': data.user_id
              });

              // Update messageDiv to show success
              messageDiv.innerText = 'Login Successful';
              messageDiv.style.backgroundColor = 'lightgreen'; // Green background for success
              messageDiv.style.color = 'black'; // Black text color
              messageDiv.style.padding = '10px';
              messageDiv.style.borderRadius = '5px';
              messageDiv.style.textAlign = 'center';

              // Clear additional message
              additionalMessageDiv.innerText = '';

              // Close the popup after 2 seconds
              setTimeout(() => {
                  window.close();
              }, 2000);

          } catch (error) {
              console.error('Error during login:', error);
              messageDiv.innerText = 'Login Failed';
              messageDiv.style.backgroundColor = 'lightcoral'; // Red background for errors
              messageDiv.style.color = 'white'; // White text color
              messageDiv.style.padding = '10px';
              messageDiv.style.borderRadius = '5px';
              messageDiv.style.textAlign = 'center';

              // Display additional message for invalid credentials
              if (error.message === 'Invalid credentials') {
                  additionalMessageDiv.innerText = 'Please check your email and password and try again.';
                  additionalMessageDiv.style.color = 'darkred'; // Dark red text color for additional messages
                  additionalMessageDiv.style.padding = '5px';
                  additionalMessageDiv.style.textAlign = 'center';
              } else {
                  additionalMessageDiv.innerText = '';
              }

              // Hide the login failed message and remove background color after 3 seconds
              setTimeout(() => {
                  messageDiv.innerText = '';
                  additionalMessageDiv.innerText = '';
                  messageDiv.style.backgroundColor = ''; // Reset background color
                  messageDiv.style.color = ''; // Reset text color
                  messageDiv.style.padding = ''; // Reset padding
                  messageDiv.style.borderRadius = ''; // Reset border radius
                  messageDiv.style.textAlign = ''; // Reset text alignment
              }, 2500);
          }
      });
  });
});
