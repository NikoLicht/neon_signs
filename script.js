fetch('./data.json')
    .then(response => response.json())
    .then((data) => { 
        main(data);
    })
    .catch(error => console.log("Problem with getting JSON", error));


const cleanJson = (data) => {
    //TODO: Check performance of this
    const parser = new DOMParser();
    const parseToString = (input) => {
        return parser.parseFromString(input, "text/html").body.textContent;
    };

    const requiredFields = ["title", "description", "imagePath"];
    return data
    .filter(element => {
        const hasRequiredFields = requiredFields.every(field => field in element);
        if (!hasRequiredFields)
            console.warn("Missing fields in input data.");
        return hasRequiredFields;
    })
    .map(element => {
        return {
            ...element, 
            title: parseToString(element.title),
            description: parseToString(element.description)
        }
    });
}


const crateSignCard = (template, title, description, imagePath) =>{
    const signCard = template.content.cloneNode(true).children[0];
    const titleElement = signCard.querySelector("[data-title]");
    const descriptionElement = signCard.querySelector("[data-description]");

    titleElement.textContent = title;
    descriptionElement.textContent = description;

    signCard.classList.add(`bg-[url(${imagePath})]`);

    return signCard;
}

const createSignElements = (data) => {
    const template = document.querySelector("[data-sign-template]");
    data = data.map((sign) => {
        return {
            ... sign, 
            element: crateSignCard(template, sign.title, sign.description, sign.imagePath)
        }
    });
    return data;
}

const populateGrid = (data) => {
    target = document.querySelector("#target")
    data.forEach(sign => {
        target.appendChild(sign.element);
    });
}

const updateSearch = (data, searchEvent) => {
    const search = searchEvent.target.value.toLowerCase();
    let matches = data.length;
    data.forEach(sign => {
        const display = 
        sign.description.toLowerCase().includes(search) ||
        sign.title.toLowerCase().includes(search);
        sign.element.classList.toggle("hidden", !display);
        if (!display)
            matches --;
    }); 
    const noResults = matches <= 0;
    document.querySelector("[data-no-results]").classList.toggle("hidden", !noResults);
}

const main = (data) =>{
    const searchInput = document.querySelector("[data-search-input]")

    //TODO: create better data flow. This is a bit shady.
    data = cleanJson(data);
    data = createSignElements(data)
    populateGrid(data);

    searchInput.addEventListener("input", (e) => {updateSearch(data, e)});

}