export class scrap {
    url = "https://start.schulportal.hessen.de";

    name() {
        fetch(this.url + '/index.php')
        .then(response => response.text())
        .then(data => {
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

                    console.log('First Name:', firstName);
                    console.log('Class:', className);
                    console.log('Last Name:', lastName);
                    console.log('Full Name:', fullName);
                    console.log('Full Name Sph:', fullNameSph);
                    console.log('Initials:', initials);
                    document.cookie = `firstName=${firstName}; path=/;`;
                    document.cookie = `lastName=${lastName}; path=/;`;
                    document.cookie = `fullName=${fullName}; path=/;`;
                    document.cookie = `fullNameSph=${fullNameSph}; path=/;`;
                    document.cookie = `className=${className}; path=/;`;
                    document.cookie = `initials=${initials}; path=/;`;
                } else {
                    console.error('Name format did not match');
                }
            }
            if (element) {
                document.open();
                document.write(`<div>${element}</div>`);
                document.close();
            } else {
                console.error('Name could not be fetched');
            }
        })
        .catch(error => console.error('Error fetching the page:', error));
    }
    homework() {
        fetch(this.url + '/meinunterricht.php')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const elements = doc.querySelectorAll('.printable[data-entry]');
            elements.forEach(element => {
                console.log(element);
                const doneSpan = element.querySelector('.done.label.label-default');
                if (doneSpan && doneSpan.textContent.trim() === 'erledigt' && !element.textContent.includes('als "erledigt" markieren')) {
                console.log('Filtered element:', element);
                const getElementText = (element, xpath) => {
                    const result = document.evaluate(xpath, element, null, XPathResult.STRING_TYPE, null);
                    return result.stringValue.trim();
                };
    
                const getElementAttribute = (element, xpath, attribute) => {
                    const result = document.evaluate(xpath, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    return result.singleNodeValue ? result.singleNodeValue.getAttribute(attribute) : '';
                };
    
                const className = getElementText(element, './td[1]/h3/a/span');
                const teacherShort = getElementText(element, './td[1]/span/div/button/text()');
                const teacherName = getElementText(element, './td[1]/span/div/ul/li[1]/a/text()');
                const thema = getElementText(element, './td[2]/b');
                const homework = getElementText(element, './td[2]/div/div');
                const linkToMore = getElementAttribute(element, './td[3]/div/a', 'href');
    
                console.log('Class:', className);
                console.log('Teacher Short:', teacherShort);
                console.log('Teacher Name:', teacherName);
                console.log('Thema:', thema);
                console.log('Homework:', homework);
                console.log('Link to More:', linkToMore);
                }
            });
        })
        .catch(error => console.error('Failed to fetch data:', error));
    }

}
