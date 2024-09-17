/**
 * extractKeyPlayerAttributes will return the key attributes that all EAFC players have. 
 * Separate logic is used depending on whether type = 'Pack' or 'Pick'
 * @param {HTMLElement} item - The player object
 * @param {string} type  - Either 'pack' or 'pick'
 * @returns {Array} - Returns an array containing the attibutes:
 * rating, name, position, is_tradeable, _is_duplicate
 */

function extractKeyPlayerAttributes(item, type) {
    // Extract rating, name and position values
    const rating = item.querySelector('.rating')?.textContent.trim();
    const name = item.querySelector('.name')?.textContent.trim();
    const position = item.querySelector('.position')?.textContent.trim();

    let is_tradeable = false;
    let is_duplicate = false;
    
    if (type === 'pick') {
        // Check if the 'Already Owned' text is displayed for this element to populate is_duplicate
        const pickElement = item.parentElement;
        const spanElements = pickElement.querySelectorAll('span')
        spanElements.forEach(span => {
            if (span.textContent.trim() === 'Already Owned') {
                // All pick elements have the text 'Already Owned' so check if the display attribute is set to None 
                if (span.style.display === 'none') {
                    is_duplicate = false;
                } else {
                    is_duplicate = true;
                }
                return;
            }
        });

    }
     else if (type === 'pack') {
        const headerElement = item.closest('.sectioned-item-list');
        const titleElement = headerElement?.querySelector('.title');
        is_duplicate = titleElement?.textContent.trim() === 'Duplicates';

        is_tradeable = !item.querySelector('.untradeable');
    }

    const itemData = {
        name,
        rating,
        position,
        is_tradeable,
        is_duplicate,
    };

    return itemData;
}




/**
 * Helper function to extract attributes from labels based on a mapping.
 * @param {HTMLElement} item - the htmlelement of the pack item
 * @param {Object} attributeMappings - The mapping of attribute names to label text.
 * @returns {Object} - The extracted attributes.
 */
function getAttributesFromLabels(item, attributeMappings) {
    const attributes = {};
    const labels = item.querySelectorAll('.player-stats-data-component .label');

    labels.forEach(label => {
        const labelText = label.textContent.trim();
        const value = label.nextElementSibling?.textContent.trim();

        // If the label matches our mapping, extract the value and store in something 
        for (const [key, mapping] of Object.entries(attributeMappings)) {
            if (labelText === mapping) {
                attributes[key] = value;
                break;
            }
        }
    });

    return attributes;
}


/**
 * This will extract the attributes of a goalkeeper item.
 * For pack items it is required to iterate through each stats .label and verify the attribute
 * The attribute is extracted using the text content of the label's sibling element.
 * @param {HTMLElement} item - player item.
 * @returns {Object} - An object containing the stats of the GK.
 */
function extractGoalkeeperAttributes(item) {
    
    const attributeMappings = {
        diving: 'DIV',
        handling: 'HAN',
        kicking: 'KIC',
        speed: 'SPD',
        reflexes: 'REF',
        positioning: 'POS',
    };

    return getAttributesFromLabels(item, attributeMappings);
}


/**
 * This will extract the attributes of an outfield player item.
 * For pack items it is required to iterate through each stats .label and verify the attribute.
 * The attribute is extracted using the text content of the label's sibling element.
 * @param {HTMLElement} item - player item.
 * @returns {Object} - An object containing the stats of the player.
 */
function extractOutfieldPlayerAttributes(item) {

    const attributeMappings = {
        pace: 'PAC',
        shooting: 'SHO',
        passing: 'PAS',
        dribbling: 'DRI',
        defending: 'DEF',
        physical: 'PHY',
    };

    return getAttributesFromLabels(item, attributeMappings);
}
