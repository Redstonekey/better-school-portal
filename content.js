class scrap {
    url = "https://start.schulportal.hessen.de";

    async name() {
        try {
            const response = await fetch(this.url + '/index.php');
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const element = doc.querySelector('.fa-child')?.parentElement?.textContent?.trim();

            if (element) {
                const nameMatch = element.match(/([^,]+),\s*([^()]+)\s*\(([^)]+)\)/);
                if (nameMatch) {
                    const lastName = nameMatch[1].trim();
                    const firstName = nameMatch[2].split(' ')[0].trim();
                    const fullName = `${nameMatch[2].trim()}, ${lastName}`;
                    const fullNameSph = `${lastName}, ${nameMatch[2].trim()}`;
                    const className = nameMatch[3].trim();
                    const initials = `${nameMatch[2].split(' ').map(name => name[0]).join('')}${lastName[0]}`;

                    return {
                        firstName: firstName,
                        lastName: lastName,
                        fullName: fullName,
                        fullNameSph: fullNameSph,
                        className: className,
                        initials: initials
                    };
                } else {
                    console.error('Name format did not match');
                    return null;
                }
            } else {
                console.error('Name could not be fetched');
                return null;
            }
        } catch (error) {
            console.error('Error fetching the page:', error);
            return null;
        }
    }

    async homework() {
        console.log('homework() function started'); // Debug Step 1
    
        try {
            console.log(`Fetching data from: ${this.url}/meinunterricht.php`); // Debug Step 2
            const response = await fetch(this.url + '/meinunterricht.php');
    
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`); // Debug Step 3a: Handle non-OK responses
                // You might want to throw an error or return null here as well
                 return null;
            }
    
            const data = await response.text();
            console.log('Data fetched successfully, parsing HTML...'); // Debug Step 3
    
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            console.log('HTML parsed.'); // Debug Step 4
    
            const elements = doc.querySelectorAll('.printable[data-entry]');
            console.log(`Found ${elements.length} elements with class 'printable' and attribute 'data-entry'.`); // Debug Step 5
    
            const homeworkResults = [];
    
            // Define helper functions outside the loop
            const getElementText = (contextNode, xpath) => {
                // Use doc.evaluate with the element as the context node for relative XPaths
                const result = doc.evaluate(xpath, contextNode, null, XPathResult.STRING_TYPE, null);
                return result.stringValue.trim();
            };
    
            const getElementAttribute = (contextNode, xpath, attribute) => {
                // Use doc.evaluate with the element as the context node for relative XPaths
                const result = doc.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return result.singleNodeValue ? result.singleNodeValue.getAttribute(attribute) : '';
            };
    
            elements.forEach((element, index) => { // Added index for easier tracking
                console.log(`--- Processing element ${index} (data-entry: ${element.getAttribute('data-entry') || 'N/A'}) ---`); // Debug Step 6: Identify current element
    
                // Find the specific element using the relative XPath
                const statusElementXPath = './td[2]/div/span[2]';
                const statusResult = doc.evaluate(statusElementXPath, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const statusElement = statusResult.singleNodeValue;
    
                console.log(`Element at "${statusElementXPath}" found: ${statusElement ? 'Yes' : 'No'}`); // Debug Step 7: Did we find the element?
    
                let isItemDone = false;
                if (statusElement) {
                    // *** LOGIC CHANGE: Check if the element has the class 'hidden' ***
                    if (statusElement.classList.contains('hidden')) {
                        isItemDone = true;
                        console.log('Element found and has the "hidden" class. Item considered DONE.'); // Debug Step 9a: It has the class
                    } else {
                        console.log('Element found but does NOT have the "hidden" class. Item considered NOT done.'); // Debug Step 9b: It does not have the class
                    }
                } else {
                     console.log(`Element not found at XPath: ${statusElementXPath}. Cannot check for "hidden" class.`); // Debug Step 7a: Not found
                     // Depending on your site's structure, if the status element is not found,
                     // it might mean it's NOT done, or it might mean something else.
                     // Based on the previous log, some elements were not found.
                     // If not finding the element means NOT done, the isItemDone = false is correct here.
                }
    
                // If the item is considered done based on the 'hidden' class check
                if (isItemDone) {
                    console.log('Item is considered DONE, processing homework details.'); // Debug Step 10: Processing begins
    
                    // Extract the data using the original relative XPaths
                    const className = getElementText(element, './td[1]/h3/a/span');
                    const teacherShort = getElementText(element, './td[1]/span/div/button/text()');
                    const teacherName = getElementText(element, './td[1]/span/div/ul/li[1]/a/text()');
                    const thema = getElementText(element, './td[2]/b');
                    const homeworkContent = getElementText(element, './td[2]/div/div'); // Renamed variable to avoid conflict
                    const linkToMore = getElementAttribute(element, './td[3]/div/a', 'href');
    
                    // Original console logs for extracted data (keeping them)
                    console.log('Extracted Data:');
                    console.log('Class name:', className);
                    console.log('Teacher short:', teacherShort);
                    console.log('Teacher name:', teacherName);
                    console.log('Thema:', thema);
                    console.log('Homework:', homeworkContent);
                    console.log('Link to more:', linkToMore);
    
    
                    homeworkResults.push({
                        className: className,
                        teacherShort: teacherShort,
                        teacherName: teacherName,
                        thema: thema,
                        homework: homeworkContent, // Using the renamed variable
                        linkToMore: linkToMore
                    });
                     console.log('Homework item added to results.'); // Debug Step 11: Item added
                } else {
                     console.log('Item is considered NOT done (element not found or missing "hidden" class), skipping.'); // Debug Step 12: Item skipped
                }
            });
    
            console.log(`Finished processing elements. Total homework items found (considered DONE): ${homeworkResults.length}`); // Debug Step 13
            console.log('Final homeworkResults:', homeworkResults); // Debug Step 14
    
            return homeworkResults;
        } catch (error) {
            console.error('An error occurred during homework fetch or processing:', error); // Debug Step 15: Log errors
            return null;
        }
    }
    async unterricht() {
        console.log('homework() function started'); // Debug Step 1
    
        try {
            console.log(`Fetching data from: ${this.url}/meinunterricht.php`); // Debug Step 2
            const response = await fetch(this.url + '/meinunterricht.php');
    
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`); // Debug Step 3a: Handle non-OK responses
                // You might want to throw an error or return null here as well
                 return null;
            }
    
            const data = await response.text();
            console.log('Data fetched successfully, parsing HTML...'); // Debug Step 3
    
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            console.log('HTML parsed.'); // Debug Step 4
    
            const elements = doc.querySelectorAll('.printable[data-entry]');
            console.log(`Found ${elements.length} elements with class 'printable' and attribute 'data-entry'.`); // Debug Step 5
    
            const homeworkResults = [];
    
            // Define helper functions outside the loop
            const getElementText = (contextNode, xpath) => {
                // Use doc.evaluate with the element as the context node for relative XPaths
                const result = doc.evaluate(xpath, contextNode, null, XPathResult.STRING_TYPE, null);
                return result.stringValue.trim();
            };
    
            const getElementAttribute = (contextNode, xpath, attribute) => {
                // Use doc.evaluate with the element as the context node for relative XPaths
                const result = doc.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return result.singleNodeValue ? result.singleNodeValue.getAttribute(attribute) : '';
            };
    
            elements.forEach((element, index) => { // Added index for easier tracking
                console.log(`--- Processing element ${index} (data-entry: ${element.getAttribute('data-entry') || 'N/A'}) ---`); // Debug Step 6: Identify current element
    
                // Find the specific element using the relative XPath
                const statusElementXPath = './td[2]/div/span[2]';
                const statusResult = doc.evaluate(statusElementXPath, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const statusElement = statusResult.singleNodeValue;
    
                console.log(`Element at "${statusElementXPath}" found: ${statusElement ? 'Yes' : 'No'}`); // Debug Step 7: Did we find the element?
    
                let isItemDone = false;
                if (statusElement) {
                    // *** LOGIC CHANGE: Check if the element has the class 'hidden' ***
                    if (statusElement.classList.contains('hidden')) {
                        isItemDone = true;
                        console.log('Element found and has the "hidden" class. Item considered DONE.'); // Debug Step 9a: It has the class
                    } else {
                        console.log('Element found but does NOT have the "hidden" class. Item considered NOT done.'); // Debug Step 9b: It does not have the class
                    }
                } else {
                     console.log(`Element not found at XPath: ${statusElementXPath}. Cannot check for "hidden" class.`); // Debug Step 7a: Not found
                     // Depending on your site's structure, if the status element is not found,
                     // it might mean it's NOT done, or it might mean something else.
                     // Based on the previous log, some elements were not found.
                     // If not finding the element means NOT done, the isItemDone = false is correct here.
                }
                // Extract the data using the original relative XPaths
                const className = getElementText(element, './td[1]/h3/a/span');
                const teacherShort = getElementText(element, './td[1]/span/div/button/text()');
                const teacherName = getElementText(element, './td[1]/span/div/ul/li[1]/a/text()');
                const thema = getElementText(element, './td[2]/b');
                const homeworkContent = getElementText(element, './td[2]/div/div'); // Renamed variable to avoid conflict
                const linkToMore = getElementAttribute(element, './td[3]/div/a', 'href');

                // Original console logs for extracted data (keeping them)
                console.log('Extracted Data:');
                console.log('Class name:', className);
                console.log('Teacher short:', teacherShort);
                console.log('Teacher name:', teacherName);
                console.log('Thema:', thema);
                console.log('Homework:', homeworkContent);
                console.log('Link to more:', linkToMore);


                homeworkResults.push({
                    className: className,
                    teacherShort: teacherShort,
                    teacherName: teacherName,
                    thema: thema,
                    homework: homeworkContent, // Using the renamed variable
                    linkToMore: linkToMore
                });
                    console.log('Homework item added to results.'); // Debug Step 11: Item added
            });
    
            console.log(`Finished processing elements. Total homework items found (considered DONE): ${homeworkResults.length}`); // Debug Step 13
            console.log('Final homeworkResults:', homeworkResults); // Debug Step 14
    
            return homeworkResults;
        } catch (error) {
            console.error('An error occurred during homework fetch or processing:', error); // Debug Step 15: Log errors
            return null;
        }
    }
}

// Get the current URL path
const currentPath = window.location.pathname;
const scraper = new scrap(); 
console.log('Current path:', currentPath);


// Helper function to replace resource paths in HTML
function replaceResourcePaths(html) {
    return html
        .replace(/src=["']\/js\/([^"']+)["']/g, (match, file) => `src="${chrome.runtime.getURL(`js/${file}`)}"`)
        .replace(/href=["']\/styles.css["']/g, `href="${chrome.runtime.getURL('styles.css')}"`)
        .replace(/href=["']\/css\/([^"']+)["']/g, (match, file) => `href="${chrome.runtime.getURL(`css/${file}`)}"`)
        .replace(/href=["']\/styles\/([^"']+)["']/g, (match, file) => `href="${chrome.runtime.getURL(`styles/${file}`)}"`)
        .replace(/src=["']\/images\/([^"']+)["']/g, (match, file) => `href="${chrome.runtime.getURL(`images/${file}`)}"`)
        .replace(/src=["']\/html\/([^"']+)["']/g, (match, file) => `href="${chrome.runtime.getURL(`html/${file}`)}"`);
}

// Handle different pages
if (currentPath === '/wp-login.php') {
    window.location.href = 'https://login.schulportal.hessen.de/?url=aHR0cHM6Ly9jb25uZWN0LnNjaHVscG9ydGFsLmhlc3Nlbi5kZS8=&skin=sp&i=5201';
} 
// Handle home page
else if (window.location.hostname === 'start.schulportal.hessen.de' && 
    (window.location.pathname === '/' || window.location.pathname === '/index.php')) {
        console.log('Home page detected');
        fetch(chrome.runtime.getURL('html/home.html'))
            .then(response => response.text())
            .then(html => {
                const nameMatch = document.querySelector('.fa-child')?.parentElement?.textContent?.trim().match(/([^(]+)/);
                const fullName = nameMatch ? nameMatch[1].trim() : '';
                const firstName = fullName.split(',')[1]?.trim().split(' ')[0] || 'Benutzer';
                const initials = fullName.split(',').map(part => part.trim()[0]).join('');
                
                // Replace the placeholder HTML with actual user data and fix resource paths
                html = replaceResourcePaths(html)
                    .replace('$MS', initials)
                    .replace('$PLACEHOLDERNAME', firstName)
                    .replace('$DATENOW', new Date().toLocaleDateString('de-DE', {
                        month: '2-digit',
                        day: '2-digit'
                    }))
                    .replace('$DAYNOW', new Date().toLocaleDateString('de-DE', {
                        weekday: 'long'
                    }));
                
                document.open();
                document.write(html);
                document.close();
            })
            .catch(error => console.error('Failed to load Better school Portal HTML:', error));
}

// Handle calendar page start.schulportal.hessen.de/kalender.php
if (window.location.hostname === 'start.schulportal.hessen.de' && 
    (window.location.pathname === '/kalender.php')) {
    console.log('Calendar page detected');
    fetch(chrome.runtime.getURL('html/calender.html'))
        .then(response => response.text())
        .then(html => {
            const nameMatch = document.querySelector('.fa-child')?.parentElement?.textContent?.trim().match(/([^(]+)/);
            const fullName = nameMatch ? nameMatch[1].trim() : '';
            const firstName = fullName.split(',')[1]?.trim().split(' ')[0] || 'Benutzer';
            const initials = fullName.split(',').map(part => part.trim()[0]).join('');

            // Replace the placeholder HTML with actual user data and fix resource paths
            html = replaceResourcePaths(html)
                .replace('MS', initials);
            
            document.open();
            document.write(html);
            document.close();
        })
        .catch(error => console.error('Failed to load calendar HTML:', serror));
}
// Handle meinunterricht page start.schulportal.hessen.de/meinunterricht.php
if (window.location.hostname === 'start.schulportal.hessen.de' &&
    (window.location.pathname === '/meinunterricht.php') &&
    (window.location.search === '?homework')) {

    console.log('Meinunterricht page detected');

    async function loadMeinunterrichtPage() {
        try {
            const homeworkData = await scraper.homework();

            if (!homeworkData) {
                console.warn('No homework data found or failed to fetch.');
            }

            const response = await fetch(chrome.runtime.getURL('html/meinunterricht.html'));
            let html = await response.text(); // Lädt das Template HTML

            let homeworkHtml = homeworkData ? homeworkData.map(hw =>
                `<div class="homework-item">
                    <h3>${hw.className} - ${hw.thema}</h3>
                    <p>${hw.homework}</p>
                    <p>Lehrer: ${hw.teacherName} (${hw.teacherShort})</p>
                    <a href="${hw.linkToMore}">Mehr Details</a>
                </div>`
            ).join('') : '<p>Keine Hausaufgaben gefunden.</p>';
            const nameMatch = document.querySelector('.fa-child')?.parentElement?.textContent?.trim().match(/([^(]+)/);
            const fullName = nameMatch ? nameMatch[1].trim() : '';
            const firstName = fullName.split(',')[1]?.trim().split(' ')[0] || 'Benutzer';
            const initials = fullName.split(',').map(part => part.trim()[0]).join('');

            html = html.replace('<div id="homework-list"></div>', `<div id="homework-list">${homeworkHtml}</div>`);
            html = html.replace('$MS', initials);
            html = html.replace('$PLACEHOLDERNAME', firstName);
            html = html.replace('$DATENOW', new Date().toLocaleDateString('de-DE', {
                month: '2-digit',
                day: '2-digit'
            }));
            html = html.replace('$DAYNOW', new Date().toLocaleDateString('de-DE', {
                weekday: 'long'
            }));

            document.body.innerHTML = html;
        } catch (error) {
            console.error('Failed to load Meinunterricht Page:', error);
        }
    }

    loadMeinunterrichtPage();
}
// Handle meinunterricht page start.schulportal.hessen.de/meinunterricht.php
if (window.location.hostname === 'start.schulportal.hessen.de' &&
    (window.location.pathname === '/meinunterricht.php') &&
    (window.location.search === '') || (window.location.search === '?')) {

    console.log('Meinunterricht page detected');

    async function loadunterrichtPage() {
        try {
            const homeworkData = await scraper.unterricht();

            if (!homeworkData) {
                console.warn('No homework data found or failed to fetch.');
            }

            const response = await fetch(chrome.runtime.getURL('html/meinunterricht.html'));
            let html = await response.text(); // Lädt das Template HTML

            let homeworkHtml = homeworkData ? homeworkData.map(hw =>
                `<div class="homework-item">
                    <h3>${hw.className} - ${hw.thema}</h3>
                    <p>${hw.homework}</p>
                    <p>Lehrer: ${hw.teacherName} (${hw.teacherShort})</p>
                    <a href="${hw.linkToMore}">Mehr Details</a>
                </div>`
            ).join('') : '<p>Keine Hausaufgaben gefunden.</p>';
            const nameMatch = document.querySelector('.fa-child')?.parentElement?.textContent?.trim().match(/([^(]+)/);
            const fullName = nameMatch ? nameMatch[1].trim() : '';
            const firstName = fullName.split(',')[1]?.trim().split(' ')[0] || 'Benutzer';
            const initials = fullName.split(',').map(part => part.trim()[0]).join('');

            html = html.replace('<div id="homework-list"></div>', `<div id="homework-list">${homeworkHtml}</div>`);
            html = html.replace('$MS', initials);
            html = html.replace('$PLACEHOLDERNAME', firstName);
            html = html.replace('$DATENOW', new Date().toLocaleDateString('de-DE', {
                month: '2-digit',
                day: '2-digit'
            }));
            html = html.replace('$DAYNOW', new Date().toLocaleDateString('de-DE', {
                weekday: 'long'
            }));

            document.body.innerHTML = html;
        } catch (error) {
            console.error('Failed to load Meinunterricht Page:', error);
        }
    }

    loadunterrichtPage();
}