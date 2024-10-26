const appName = document.getElementById('appName');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const ageInput = document.getElementById('age');
const addButton = document.getElementById('addButton');
const usersList = document.getElementById('usersList');

let rowNumber = 1

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

const storedUsers = JSON.parse(JSON.stringify(usersFromData))

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
        } catch (error) {
            console.log("Error while fetch appName")
            throw error
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
        const users = await UserService.getUser() || [];
        console.log(users);
        console.log(users.size);

        if (users.size) {
            users.forEach((user) => {
                console.log('user = ', user);
                UI.addUserToList(user)
            })
        }
    }

    static addUserToList(user) {
        const row = document.createElement('tr')
        row.innerHTML = `
            <th scope="row">${rowNumber}</th>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.id}</td>
        `;
        usersList.appendChild(row)
        rowNumber++
    }

    static async createUser() {
        if(UI.isFormValid()) {
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            const age = ageInput.value;

            await UserService.postUsers(firstName, lastName, age);
            console.log(firstName, lastName, age)
            await UserService.getUser();
        }
    }
}

class AppService {
    static getAppName() {
        return fetch("http://localhost:5000/api/")
            .then(response =>{
                if (response.status !== 200) {
                    console.log("[ERROR] response status: ", response.status)
                    throw new Error('Failed to fetch appName')
                } else{
                    return response.text()
                }
            })
            .catch(error => {
                console.log("fetch error", error)
                throw error
            })
    }
}

class UserService {
    static getUser() {
        return fetch("http://localhost:5000/api/users/")
            .then(async response => {
                if (response.status !== 200) {
                    console.error("[ERROR] Response status: ", response.status);
                    throw new Error("Failed to fetch users.")
                }
                // if response.code = 200 -> 2 ways
                const contentType = response.headers.get('Content-Type');

                // 1. Content type = 'text/html'
                if (contentType.includes('text/html')) {
                    // "There are no users"
                    const responseText = await response.text();
                    return responseText;

                    // 2. Content type = 'application/json'
                } else if (contentType.includes('application/json')) {
                    // list of users in json
                    return response.json();
                    // 3. catchError
                } else {
                    console.error("[ERROR] Unexpected Content-Type: ", contentType);
                    throw new Error("[ERROR] Unexpected Content-Type.")
                }
            })
            .catch(error => {
                console.error("Fetch error: ", error);
                throw error;
            })
    }

    static async postUsers(firstName, lastName, age) {
        if(!firstName || !lastName || age === undefined) {
            console.error("[ERROR] Invalid parameters.")
            throw new Error ("Invalid parameters.");
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/users/",
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
                });

            if (response.status !== 200) {
                console.error("[ERROR] Response status:", response.status);
                throw new Error("Failed to post users.");
            }

            const contentType = response.headers.get('content-type');

            if(contentType.includes('text/html')) {
                const responseText = await response.text();
                console.log("Content Type = ", responseText);
                return responseText;
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
document.addEventListener('DOMContentLoaded', UI.displayAppName)
//event to activate addButton
document.addEventListener('input', UI.activateAddButton)
//event to display users
document.addEventListener("DOMContentLoaded", UI.displayUsers)
//event to add user to DB, get list of all users, create user as an object, and display user in the table
document.getElementById('form-user').addEventListener('submit', async (event) => {
    event.preventDefault();
    await UI.createUser();
});