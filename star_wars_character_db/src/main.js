// Getting the search input
const searchInput = document.getElementById("search-input");

// Adding an event listener that listens to whenever the user types something into the search bar
searchInput.addEventListener("input", function (e) {
    // Get the value of the input
    const input = e.target.value;
    console.log(input);
    if (input.length >= 1) {
        debouncedCharacterSearch(input);
    }
});

// Function to display characters in the results
function displayCharacters(characters) {
    const listOfCharacterNames = characters.map(character => {
        return `<li><a data-url="${character.url}">${character.name}</a></li>`;
    }).join(" ");
    results.innerHTML = `<ul class="characters">${listOfCharacterNames}</ul>`;
}

// Fetching characters on page load
const results = document.getElementById("results");

document.addEventListener("DOMContentLoaded", function () {
    fetch("https://swapi.py4e.com/api/people")
        .then(resp => resp.json())
        .then(data => {
            if (data.count >= 1) {
                displayCharacters(data.results);
            } else {
                displayError();
            }
        })
        .catch(e => {
            console.log(e);
            displayError();
        });
});

// Debounce function to limit search requests
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Async function to search for characters
async function searchForCharacter(query) {
    const characterData = await fetch(`https://swapi.py4e.com/api/people?search=${query}`).then(resp => resp.json());
    console.log(characterData);
    if (characterData.count >= 1) {
        displayCharacters(characterData.results);
    } else {
        displayError();
    }
}

// Debounced version of searchForCharacter function
const debouncedCharacterSearch = debounce(searchForCharacter, 500);

// Error display function
function displayError() {
    results.innerHTML = "<ul class='characters'><li>The characters you seek are not here</li></ul>";
}

// Dialog handling
const dialog = document.getElementById("popup-dialog");
const characterTitle = document.getElementById("character-title");
const dialogContent = document.getElementById("dialog-content");
const closeDialogButton = document.getElementById("close-dialog");

function openCharacterDialog(characterApiUrl) {
    dialog.showModal();
    fetch(characterApiUrl)
        .then(resp => resp.json())
        .then(data => {
            characterTitle.innerText = data.name;
            dialogContent.innerHTML = `
                <p><strong>Height:</strong> ${data.height}</p>
                <p><strong>Mass:</strong> ${data.mass}</p>
                <p><strong>Gender:</strong> ${data.gender}</p>
            `;
        })
        .catch(err => {
            console.log(err);
            dialogContent.innerHTML = 'Failed to load data.';
        });
}

// Add event listeners to links in the characters list
const links = document.querySelectorAll('.characters a');
links.forEach(link => {
    link.addEventListener('click', () => {
        const characterUrl = link.getAttribute('data-url');
        openCharacterDialog(characterUrl);
    });
});

// Close dialog when clicking outside of it
dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
        dialog.close();
    }
});

// Reset dialog content when closed
dialog.addEventListener("close", () => {
    characterTitle.innerText = "";
    dialogContent.innerHTML = "Loading...";
});

// Close the dialog when the close button is clicked within the dialog element
closeDialogButton.addEventListener('click', () => {
    dialog.close();
});
