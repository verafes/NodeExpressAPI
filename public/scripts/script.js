const appName = document.getElementById('appName');
const userIdInput = document.getElementById('userId');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const ageInput = document.getElementById('age');
const addButton = document.getElementById('addButton');
const searchButton = document.getElementById('searchButton');
const editButton = document.getElementById('editButton');
const deleteButton = document.getElementById('deleteButton');
const usersList = document.getElementById('usersList');
const formAdd = document.getElementById('form-user');
const formSearch = document.getElementById('form-search');
const formEdit = document.getElementById('form-edit');
const formDelete = document.getElementById('form-delete');

let rowNumber = 1;
const PORT = 5000;
const defaultIdPlaceholder = "Enter user ID ..."
const defaultFirstNamePlaceholder = "Enter first name ..."
const defaultLastNamePlaceholder = "Enter last name ..."
const defaultAgePlaceholder = "Enter age ..."

//mock data
const usersFromData = [
    {
        "firstName": "John",
        "lastName": "Doe",
        "age": 35,
        "id": "23232323"
    },
    {
        "firstName": "Jane",
        "lastName": "Doe",
        "age": 30,
        "id": "23232324"
    },
    {
        "firstName": "Johnny",
        "lastName": "Doe",
        "age": 5,
        "id": "23232325"
    }
]

const storedUsers = JSON.parse(JSON.stringify(usersFromData));

class User {
    constructor(firstName, lastName, age, id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.id = id;
    }
}

class UI {
    static async displayAppName() {
        try {
            appName.innerText =  await AppService.getAppName();
        } catch(error) {
            console.error('Error while catching app name: ', error);
            throw error;
        }
    }

    static isFormValid() {
        const isFirstNameValid = firstNameInput.value.trim().length > 0;
        const isLastNameValid = lastNameInput.value.trim().length > 0;
        const isAgeValid = ageInput.value.trim().length > 0;

        return isFirstNameValid && isLastNameValid && isAgeValid;
    }

    static activateAddButton() {
        const isValid = UI.isFormValid();
        console.log("isValid = ", isValid);
        addButton.disabled = !isValid;
    }

    static async displayUsers() {
        // const users = storedUsers; // Mock data
        const users = await UserService.getUsers();

        if (Array.isArray(users) && users.length) {
            users.forEach((user) => {
                console.log('user = ', user);
                UI.addUserToList(user);
            });
        }
    }

    static async createUser() {
        if(UI.isFormValid()) {
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            const age = ageInput.value;

            //API call POST to endpoint '/users'
            await UserService.postUsers(firstName, lastName, age);

            //API call GET to endpoint '/users'
            const users = await UserService.getUsers();

            console.log("users from GET call", users);

            let userID = 0;
            let newUser = {};

            users.forEach((user) => {
                if(user.firstName === firstName
                    && user.lastName === lastName
                    && user.age === age
                ) {
                    userID = user.id;
                    console.log("userID from server = ", userID);

                    newUser = new User(user.firstName, user.lastName, user.age, userID);
                    console.log("Object of class User (OOP): ", newUser);
                }
            })

            return newUser;
        }
    }

    static addUserToList(user) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">${rowNumber}</th>
            <td data-row="firstName">${user.firstName}</td>
            <td data-row="lastName">${user.lastName}</td>
            <td data-row="age">${user.age}</td>
            <td data-row="userId">${user.id}</td>
            <td>
                <i class="icon" id="editIcon">
                    <a href="/edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                    </a>
                </i>
            </td>
            <td>
                <i class="icon" id="deleteIcon">
                    <a href="/delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                    </a>
                </i>
            </td>
        `;

        usersList.appendChild(row);
        rowNumber++;
    }

    static getSearchCriteria() {
        const userIdValue = userIdInput.value.trim().length > 0 ? userIdInput.value.trim() : '';
        const firstNameValue = firstNameInput.value.trim().length > 0 ? firstNameInput.value.trim() : '';
        const lastNameValue = lastNameInput.value.trim().length > 0 ? lastNameInput.value.trim() : '';
        const ageValue = ageInput.value.trim().length > 0 ? ageInput.value.trim() : -1;

        if(userIdValue.length || firstNameValue.length || lastNameValue.length || ageValue !== -1) {
            return {
                'userId': userIdValue,
                'firstName': firstNameValue,
                'lastName': lastNameValue,
                'age': ageValue,
            };
        }

        return {};
    }

    static isSearchCriteriaValid(searchCriteria) {
        return Object.keys(searchCriteria).length > 0;

    }

    static activateSearchButton() {
        const searchCriteria = UI.getSearchCriteria();
        console.log("searchCriteria", searchCriteria);

        if(UI.isSearchCriteriaValid(searchCriteria)) {
            searchButton.disabled = false;
        }
    }

    static preventSearchUrl() {
        if(window.location.pathname === '/search?') {
            window.history.pushState({}, '', '/search');
        }
    }

    static async searchUsers() {
        const searchCriteria = UI.getSearchCriteria();
        if(UI.isSearchCriteriaValid(searchCriteria)) {
            const users = await UserService.getUsers() || [];

            console.log("Users from DB: ", users);

            if(typeof users !== 'string' && users.length) {
                usersList.innerHTML = '';
                let searchResultRowNumber = 1;
                users.forEach((user) => {
                    if (
                        user.id === searchCriteria.userId
                        || user.firstName === searchCriteria.firstName
                        || user.lastName === searchCriteria.lastName
                        || user.age === searchCriteria.age
                    ) {
                        const foundUser = new User(user.firstName, user.lastName, user.age, user.id);

                        console.log("Found User: ", foundUser);

                        UI.addUserToList(user, searchResultRowNumber);
                    }
                })
            }
        }
    }

    static getRowText(event) {
        const userRow = event.target.closest('tr');

        let userInfo = [];

        if(userRow) {
            const userCells = userRow.cells;
            for(let i = 1; i < 5; i++) {
                userInfo[i-1] = userCells[i].textContent.trim();
            }
        }

        return userInfo;
    }

    static clearLocalStorage() {
        if(localStorage.getItem('idValue') !== null) {
            localStorage.removeItem('idValue');
        }
        if(localStorage.getItem('firstNameValue') !== null) {
            localStorage.removeItem('firstNameValue');
        }
        if(localStorage.getItem('lastNameValue') !== null) {
            localStorage.removeItem('lastNameValue');
        }
        if(localStorage.getItem('ageValue') !== null) {
            localStorage.removeItem('ageValue');
        }
    }

    static setValuesToLocalStorage(user) {
        if (user !== null) {
            localStorage.setItem('idValue', user.id);
            localStorage.setItem('firstNameValue', user.firstName);
            localStorage.setItem('lastNameValue', user.lastName);
            localStorage.setItem('ageValue', user.age);
        }
    }

    static fillPlaceholders() {
        //Check if local storage data exists
        const id = localStorage.getItem('idValue');
        const firstName = localStorage.getItem('firstNameValue');
        const lastName = localStorage.getItem('lastNameValue');
        const age = localStorage.getItem('ageValue');

        //Update placeholders
        userIdInput.placeholder = id ? id : defaultIdPlaceholder;
        firstNameInput.placeholder = firstName ? firstName : defaultFirstNamePlaceholder;
        lastNameInput.placeholder = lastName ? lastName : defaultLastNamePlaceholder;
        ageInput.placeholder = age ? age : defaultAgePlaceholder;
    }

    static activateEditButton() {
        editButton.disabled = false;
    }

    static activateDeleteButton() {
        if(userIdInput.placeholder !== defaultIdPlaceholder
            && firstNameInput.placeholder !== defaultFirstNamePlaceholder
            && lastNameInput.placeholder !== defaultLastNamePlaceholder
            && ageInput.placeholder !== defaultAgePlaceholder
        ) {
            userIdInput.readOnly = true;
            firstNameInput.readOnly = true;
            lastNameInput.readOnly = true;
            ageInput.readOnly = true;

            deleteButton.disabled = false;
        }
    }
}

class AppService {
    static getAppName() {
        return fetch(`http://localhost:${PORT}/api/`)
            .then(response => {
                if (response.status !== 200) {
                    console.error("[ERROR] Response status: ", response.status);
                    throw new Error('[ERROR] Failed to fetch app name. Unexpected response status.');
                }

                return response.text();
            })
            .catch(error => {
                console.error('[ERROR] Fetch error:', error);
                throw error;
            })
    }
}

class UserService {
    static getUsers() {
        return fetch(`http://localhost:${PORT}/api/users/`)
            .then(response => {
                if (response.status !== 200) {
                    console.error("[ERROR] Response status: ", response.status);
                    throw new Error("[ERROR] Failed to fetch users.");
                }
                // if response.code === 200 -> 2 ways
                const contentType = response.headers.get('Content-Type');

                // 1. Content type = 'text/html'
                if (contentType.includes('text/html')) {
                    // "There are no users"

                    return response.text();

                // 2. Content type = 'application/json'
                } else if (contentType.includes('application/json')) {
                    // list of users in json
                    return response.json();
                // 3. catchError
                } else {
                    console.error("[ERROR] Unexpected Content-Type: ", contentType);
                    throw new Error("[ERROR] Unexpected Content-Type.");
                }
            })
            .catch(error => {
                console.error("[ERROR] Fetch error: ", error);
                throw error;
            })
    }

    static async postUsers(firstName, lastName, age) {
        if(!firstName || !lastName || age === undefined) {
            console.error("[ERROR] Invalid parameters.");
            throw new Error("Invalid parameters.");
        }

        try {
            const response = await fetch(
                `http://localhost:${PORT}/api/users/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            firstName: firstName,
                            lastName: lastName,
                            age: age,
                        }
                    )
                })

            if (response.status !== 200) {
                console.error("[ERROR] Response status:", response.status);
                throw new Error("Failed to post users.");
            }

            const contentType = response.headers.get('Content-Type');

            if(contentType.includes('text/html')) {

                return await response.text();
            } else {
                console.error("[ERROR] Unexpected Content-Type: ", contentType);
                throw new Error("Unexpected Content-Type.");
            }
        } catch(error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }
}

//event to show App Name
document.addEventListener('DOMContentLoaded', UI.displayAppName);

//event to display users
document.addEventListener('DOMContentLoaded', UI.displayUsers);

// we are on tab Add
if(formAdd !== null){
    //event to activate addButton
    formAdd.addEventListener('input', UI.activateAddButton);

    //event to add user to DB, get list of all users, create user as an object, and display user in the table
    formAdd.addEventListener('submit', async (event) => {
        event.preventDefault();
        const user = await UI.createUser();
        UI.addUserToList(user);

        formAdd.reset();
        addButton.disabled = true;
    });
}

// we are on Search tab
if(formSearch !== null) {
    formSearch.addEventListener('input', UI.activateSearchButton);

    formSearch.addEventListener('submit', async (event) => {
        event.preventDefault();
        UI.preventSearchUrl();

        await UI.searchUsers();

        formSearch.reset();
        searchButton.disabled = true;
    });
}

//we are on any tab
usersList.addEventListener('click', (event) => {
    console.log(event.target);
    if(event.target.classList.contains('bi-pen') || event.target.classList.contains('bi-trash')) {
        let userInfo = UI.getRowText(event);
        let copiedUser = new User(userInfo[0], userInfo[1], userInfo[2], userInfo[3]);
        console.log("copiedUser", copiedUser);

        UI.clearLocalStorage();
        UI.setValuesToLocalStorage(copiedUser);
    }
})

//we are on tab Edit
if(formEdit !== null) {
    document.addEventListener('DOMContentLoaded', () => {
        UI.fillPlaceholders();
        if(userIdInput.placeholder !== defaultIdPlaceholder) {
            userIdInput.readOnly = true;
        }
    })

    firstNameInput.addEventListener('input', () => {
        firstNameInput.style.background = "#E8F0FE";
        UI.activateEditButton();
    })

    lastNameInput.addEventListener('input', () => {
        lastNameInput.style.background = "#E8F0FE";
        UI.activateEditButton();
    })

    ageInput.addEventListener('input', () => {
        ageInput.style.background = "#E8F0FE";
        UI.activateEditButton();
    })
}

//we are on tab Delete
if(formDelete !== null) {
    document.addEventListener('DOMContentLoaded', () => {
        UI.fillPlaceholders();
        UI.activateDeleteButton();
    })
}