const form = document.querySelector(".form");
const formButton = document.querySelector("form button");
const nome = document.querySelector("#name");
const birthDate = document.querySelector("#birth-date");
const tbody = document.querySelector("tbody")

let formMode = "CREATE"

let editingRow;

const pessoas = []

populatePeopleTable()


form.addEventListener("submit", submitForm);

editingForm()




function clearInputs() {
    nome.value = "";
    birthDate.value = "";
}


function addRow(person){
    const row = document.createElement("tr")
    const tableName = document.createElement("td")
    const tableBirthDate = document.createElement("td")
    const btnRow = document.createElement("td");

    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    editBtn.innerText = "Editar"
    deleteBtn.innerText = "Apagar"

    editBtn.classList.add("edit-btn")
    editBtn.addEventListener("click", editPersonRow)
    

    deleteBtn.classList.add("delete-btn")
    deleteBtn.addEventListener("click", deletePersonRow)
    

    btnRow.classList.add("border", "border-gray-400");
    btnRow.appendChild(editBtn)
    btnRow.appendChild(deleteBtn)

    tableName.innerText = person.Nome
    tableName.classList.add("border", "border-gray-400", "md:py-4", "lg:py-6", "lg:text-xl");

    tableBirthDate.innerText = person.Nascimento
    tableBirthDate.classList.add("border", "border-gray-400", "md:py-4", "lg:py-6", "lg:text-xl");

    row.appendChild(tableName)
    row.appendChild(tableBirthDate)
    row.appendChild(btnRow)

    tbody.appendChild(row)
}


function parseBirthDate(date){
    const dateArray = date.split("-")
    dateArray.reverse()

    return dateArray.join("/")
}

function unParseBirthDate(date) {
    const dateArray = date.split("/");
    dateArray.reverse();

    return dateArray.join("-");
}

function addToLocalStorage(object){
    localStorage.setItem("pessoas", JSON.stringify(object));
}


function getPeopleFromStorage(){
    return JSON.parse(localStorage.getItem("pessoas"));
}


function fillInTable(listOfPeople){
    for (const person of listOfPeople) {
        addRow(person)
    }
}


function populatePeopleTable() {
    // Retrieve people data from local storage
    const peopleData = getPeopleFromStorage();

    // Check if the data is not null
    if (peopleData !== null) {
        // Populate the table with the retrieved data
        fillInTable(peopleData);
        pessoas.push(...peopleData)
    } else {
        console.error("No people data found in local storage.");
        // Optionally, handle the case where no data is found, e.g., display a message to the user
    }
}


function deletePersonRow(){
    this.parentElement.parentElement.remove();

    let personName = this.parentElement.parentElement.children[0].innerHTML;
    let personBirth = this.parentElement.parentElement.children[1].innerHTML;

    deletePerson(personName, personBirth)
}

function deletePerson(personName, personBirth){
    for (let i = 0; i < pessoas.length; i++) {
        if(pessoas[i].Nome == personName && pessoas[i].Nascimento == personBirth){
            pessoas.splice(i,1)

            break
        }
        
    }

    addToLocalStorage(pessoas)
}

function editPerson(oldName, oldBirth, newName, newBirth) {
    for (let i = 0; i < pessoas.length; i++) {
        if (
            pessoas[i].Nome == oldName &&
            pessoas[i].Nascimento == oldBirth
        ) {
            pessoas[i].Nome = newName 
            pessoas[i].Nascimento = parseBirthDate(newBirth);
            break;
        }
    }

    addToLocalStorage(pessoas);
}

function editPersonRow() {

    formMode = "UPDATE"
    formButton.innerText = "Salvar Alterações"
    nome.focus()

    formButton.classList.remove("bg-green-400", "hover:bg-green-600", "w-32");
    formButton.classList.add("bg-yellow-400", "hover:bg-yellow-500", "w-56");

    let personName = this.parentElement.parentElement.children[0].innerText;
    let personBirth = this.parentElement.parentElement.children[1].innerText;

    nome.value = personName
    birthDate.value = unParseBirthDate(personBirth)

    editingRow = this.parentElement.parentElement;
}


function submitForm(event){
    if (formMode === "CREATE") {
        event.preventDefault();
        console.log(nome.value);
        console.log(birthDate.value);

        pessoas.push({
            Nome: nome.value,
            Nascimento: parseBirthDate(birthDate.value),
        });

        clearInputs();

        console.log(pessoas);

        addToLocalStorage(pessoas);

        addRow(pessoas.at(-1));
    }
}


function editingForm(){

    form.addEventListener("submit", (event) => {
        if (formMode === "UPDATE") {
            event.preventDefault();

            console.log(nome.value)
            console.log(birthDate.value)

            console.log(editingRow)

            console.log(editingRow.children);

            editPerson(
                editingRow.children[0].innerText,
                editingRow.children[1].innerText,
                nome.value,
                parseBirthDate(birthDate.value)
            );

            editingRow.children[0].innerText = nome.value;

            editingRow.children[1].innerText = parseBirthDate(birthDate.value);


            clearInputs()

            formButton.classList.remove("bg-yellow-400", "hover:bg-yellow-500", "w-56");
            formButton.classList.add("bg-green-400", "hover:bg-green-600", "w-32");
            

            formButton.innerText = "Adicionar";

            formMode = "CREATE"
        }
    });

}