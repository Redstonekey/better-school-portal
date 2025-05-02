export class scrap {
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
        try {
            const response = await fetch(this.url + '/meinunterricht.php');
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const elements = doc.querySelectorAll('.printable[data-entry]');
            const homeworkResults = [];

            elements.forEach(element => {
                const doneSpan = element.querySelector('.done.label.label-default');
                if (doneSpan && doneSpan.textContent.trim() === 'erledigt' && !element.textContent.includes('als "erledigt" markieren')) {

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

                    homeworkResults.push({
                        className: className,
                        teacherShort: teacherShort,
                        teacherName: teacherName,
                        thema: thema,
                        homework: homework,
                        linkToMore: linkToMore
                    });
                }
            });

            return homeworkResults;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return null;
        }
    }
}
