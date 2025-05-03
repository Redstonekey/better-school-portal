// Get the current URL path
const currentPath = window.location.pathname;
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
                    .replace('MS', initials)
                    .replace('PLACEHOLDERNAME', firstName);
                
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
    (window.location.pathname === '/meinunterricht.php')) {
    console.log('Meinunterricht page detected');
    
    // Fetch the meinunterricht.html content
    fetch(chrome.runtime.getURL('html/meinunterricht.html'))
        .then(response => response.text())
        .then(html => {
            // Clear existing styles
            const existingStyles = document.querySelectorAll('link[rel="stylesheet"], style');
            existingStyles.forEach(style => style.remove());

            // Add only our styles.css
            const head = document.head;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = chrome.runtime.getURL('styles.css');
            head.appendChild(link);

            // document.open();
            // document.write(html);
            // document.close();
        })
        .catch(error => console.error('Failed to load meinunterricht HTML:', error));
}
