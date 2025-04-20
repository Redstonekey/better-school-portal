// Get the current URL path
const currentPath = window.location.pathname;

// Check if the path matches `/login` or `/wp-login.php`
if (currentPath === '/wp-login.php') {
    window.location.href = 'https://login.schulportal.hessen.de/?url=aHR0cHM6Ly9jb25uZWN0LnNjaHVscG9ydGFsLmhlc3Nlbi5kZS8=&skin=sp&i=5201';
    } else if (window.location.href.includes('https://start.schulportal.hessen.de')) {
        fetch(chrome.runtime.getURL('home.html'))
            .then(response => response.text())
            .then(html => {
                const nameMatch = document.querySelector('.fa-child')?.parentElement?.textContent?.trim().match(/([^(]+)/);
                const fullName = nameMatch ? nameMatch[1].trim() : '';
                const firstName = fullName.split(',')[1]?.trim().split(' ')[0] || 'Benutzer';
                const initials = fullName.split(',').map(part => part.trim()[0]).join('');
                
                // Replace the placeholder HTML with actual user data
                html = html.replace('MS', initials)
                           .replace('Max', firstName);
                
                document.open();
                document.write(html);
                document.close();
            })
            .catch(error => console.error('Failed to load Better school Portal HTML:', error));
}