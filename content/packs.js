/**
 * addEventListenersToPacks will be triggered when ever a change in the DOM is detected
 * It will look for the presence of the Open button for packs
 * If packs are located on screen event listeners will be added to the Open button for each pack
 * Upon a click it will trigger the function handlePackOpened
 */
function addEventListenersToPacks() {


    // testing local storage:
    // chrome.storage.local.get(["userId"]).then((result) => {
    //   let userID = result.userId || 0;
    //   console.log(userID); // Use the userID as needed
    // });
    // Get all Open buttons on the page
    const openButtons = document.querySelectorAll('button.currency.call-to-action');
  
    openButtons.forEach(button => {
    // Extract the pack name from the closest `ut-store-pack-details-view` container
        const detailsView = button.closest('.ut-store-pack-details-view');
        if (!detailsView) {
            console.log("no details view for this button")
            return; 
        }
      
        //Extract the pack name
        const packNameElement = detailsView.querySelector('h1.ut-store-pack-details-view--title span');
        const packName = packNameElement ? packNameElement.textContent.trim() : 'Unknown Pack';
  
        // If no listener is added, mark the listener as added
        if (!button.dataset.listenerAdded) {
        button.dataset.listenerAdded = 'true';
  
        console.log(`Added an event listener to pack: ${packName}`);
        
        // Add event listener to the button
        button.addEventListener('click', () => {
            // Delay the execution by 5 seconds to allow pack opening animation to finish
            setTimeout(() => {
                handlePackOpened(packName); // Call the function to handle pack opening
            }, 5000); // 5000 milliseconds = 5 seconds
        });
      }
    });
  }



/**
 * Waits for the presence of the items header element with a timeout.
 * @returns {Promise<void>}
 */
function waitForItemsHeader() {
    return new Promise((resolve, reject) => {
        const timeout = 20000; 
        let timer;

        // Function to clean up after timeout or successful observation
        function cleanup() {
            if (timer) clearTimeout(timer);
            observer.disconnect();
        }

        // Create a MutationObserver to watch for changes in the DOM
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.matches('h2.title') && node.textContent.trim() === 'Items') {
                            cleanup();
                            resolve();
                            return;
                        }
                    }
                }
            }
        });

        // Observe changes in the DOM
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Set a timeout to reject the promise if the header is not found within 10 seconds
        timer = setTimeout(() => {
            cleanup();
            reject(new Error('Timeout: items header not found within 10 seconds'));
        }, timeout);

        // Optionally, check periodically if the header is already present
        const intervalId = setInterval(() => {
            const headerElement = document.querySelector('h2.title');
            if (headerElement && headerElement.textContent.trim() === 'Items') {
                clearInterval(intervalId);
                cleanup();
                resolve();
            }
        }, 100); // Check every 100ms or adjust as necessary
    });
}


  
/**
 * This is triggered after a pack has been opened. It will iterate through each item in the pack and extract
 * the data for each item. The variable names are returned according to the column definitions that they represent
 * E.g. is_duplicate, is_tradeable, etc
 * Each item will be stored as an element of itemsData
 * The data is then sent to the backend via sendBatchDataToBackend
 * @param {String} packName : pack name that has been opened
 */
async function handlePackOpened(packName) {
    console.log(`${packName} has been opened`);

    // let userID = JSON.parse(localStorage.getItem('userId')) || 0;
    chrome.storage.local.get(["userId"]).then((result) => {
      let userID = result.userId || 0;
      console.log("user_id = ", userID); 
    });


    // Wait for the items header to be present
    await waitForItemsHeader();

    const packItems = document.querySelectorAll('.entityContainer');
    console.log(`Pack Items Length: ${packItems.length}`);

    let itemsData = [];
    packItems.forEach(item => {
        let itemData = extractKeyPlayerAttributes(item, 'pack');
        itemData.pack_name = packName;
        itemData.user_id = userID;
        if (!itemData.rating) return;

        const position = itemData.position;
        if (position === "GK") {
            itemData = { ...itemData, ...extractGoalkeeperAttributes(item) };
        } else {
            itemData = { ...itemData, ...extractOutfieldPlayerAttributes(item) };
        }

        console.log("Item object:", itemData);
        itemsData.push(itemData);
    });

    console.log("ItemsData: ", itemsData);
    sendBatchDataToBackend({ pack_name: packName, items: itemsData }, '/packs/');
}
