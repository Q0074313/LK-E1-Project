let recipe
let recipename
let sort1
let sort2
let searchTerm
let selectedCategories

function clearsearchbar(){
    document.querySelector('.search-bar input').value = ''
    loadrecipelist()
}

function loadrecipelist(){

    searchTerm = document.querySelector('.search-bar input').value.toLowerCase();

    selectedCategories = Array.from(document.querySelectorAll('.filterCheckbox:checked')).map(checkbox => checkbox.value);



    console.log(selectedCategories);

    fetch('rezepte.json')
    .then(function(response){
        return response.json();
    })
    .then(function(rezeptelist){
        let placeholder = document.querySelector('#recipelist');
        let out = '';
        for(rezept of rezeptelist){
            if (matchesFilters(rezept, selectedCategories) && matchesSearchTerm(rezept, searchTerm)) {
                out += `
                    <a class="recipe-link" href="recipe.html" onclick="loadrecipe(this)" id="${rezept.id}" name="${rezept.gericht}" data-sort1="${rezept.sort1}" data-sort2="${rezept.sort2}">
                        <div class="recipe">
                            <div class="recipe-picture">
                                <img src="${rezept.bild}" alt="Gericht">
                            </div>
                            <div class="recipe-text">
                                <h2>${rezept.gericht}</h2>
                                <div>
                                    <p>${rezept.sort1}</p>
                                    <p>${rezept.sort2}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                `;
            }
            
            
            console.log(rezept.sort1, rezept.sort2)
        }
        placeholder.innerHTML = out;
    })
}

function matchesFilters(recipe, selectedCategories) {
    if (selectedCategories.length === 0) {
        return true;
    }
    return recipe.categories.some(category => selectedCategories.includes(category));
}

function matchesSearchTerm(recipe, searchTerm) {
    return recipe.gericht.toLowerCase().includes(searchTerm);
}

function loadrecipe(clickedElement){
    recipe = clickedElement.id
    localStorage.setItem('selectedRecipe', recipe);
    recipename = clickedElement.name
    localStorage.setItem('recipename', recipename);

    sort1 = clickedElement.dataset.sort1
    localStorage.setItem('sort1', sort1);
    sort2 = clickedElement.dataset.sort2
    localStorage.setItem('sort2', sort2);
    console.log(sort1, sort2)
}

function recipesiteload(){
    recipe = localStorage.getItem('selectedRecipe');
    document.getElementById('recipe-image').src = "rezepte/"+recipe+".jpg"
    recipe = 'rezepte/' + recipe

    recipename = localStorage.getItem('recipename');
    document.getElementById('recipe-name').innerHTML = recipename
    sort1 = localStorage.getItem('sort1');
    document.getElementById('recipe-sortA').innerHTML = sort1
    sort2 = localStorage.getItem('sort2');
    document.getElementById('recipe-sortB').innerHTML = sort2

    fetch(recipe+'.json')
    .then(function(response){
        return response.json();
    })
    .then(function(zutaten){
        let placeholder = document.querySelector('#table-content');
        let out = '';
        for(let zutat of zutaten){
            out += `
                <tr>
                    <td>${zutat.zutat}</td>
                    <td>${zutat.menge} ${zutat.einheit}</td>
                    <td>${(zutat.menge)*document.getElementById('recipe-multiplicator').value} ${zutat.einheit}</td>
                </tr>
            `;
        }

        placeholder.innerHTML = out;
    })
    fetch(recipe+'.txt')
    .then(response => response.text())
    .then((data) => {
        document.getElementById('anleitung').innerHTML = data
    })



}

function calculaterecipe(){
    fetch(recipe+'.json')
    .then(function(response){
        return response.json();
    })
    .then(function(zutaten){
        let placeholder = document.querySelector('#table-content');
        let out = '';
        for(let zutat of zutaten){
            out += `
                <tr>
                    <td>${zutat.zutat}</td>
                    <td>${zutat.menge} ${zutat.einheit}</td>
                    <td>${(zutat.menge)*document.getElementById('recipe-multiplicator').value} ${zutat.einheit}</td>
                </tr>
            `;
        }

        placeholder.innerHTML = out;
    })
}

function openNewWindow() {
    document.getElementById('floating-div').style.display = 'flex';
    let multiplicator = document.getElementById('recipe-multiplicator').value;
    let qrvalue = generateQRdata(multiplicator);
    document.getElementById('qrImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${qrvalue}`
}

function generateQRdata(multiplicator){
    let tableRows = document.getElementById('ingredientTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    let qrData = `Zutaten für ${recipename} für ${multiplicator} Personen:  \n`;

    for (let i = 0; i < tableRows.length; i++) {
        let cells = tableRows[i].getElementsByTagName('td');
        let ingredient = cells[0].innerText;
        let calculatedAmount = cells[2].innerText;

        qrData += `${calculatedAmount} ${ingredient},  \n`;
    }
    console.log(qrData)
    return qrData;
}

function closeFloatingDiv(){
    document.getElementById('floating-div').style.display = 'none';
}

function neuezutat(){
    let placeholder = document.querySelector('#create-recipe-table-content');
    let out = `
        <tr>
            <td><input type="text"></td>
            <td><input type="number"></td>
            <td><input type="text"></td>
        </tr>
    `
    placeholder.innerHTML += out;
}



// import { readFileSync, writeFileSync } from 'fs'

// function rezepthochladen(){
//     let data = readFileSync('rezepte.json')
//     let jsonData = JSON.parse(data);
//     let id = document.getElementById('create-recipe-name').value.toLowerCase()
//     id.Trim()
//     document.getElementById('create-recipe-image-input').addEventListener('change', getFileName);
//     let fileName
//     let getFileName = (event) => {
//         let files = event.target.files;
//         fileName = files[0].name;
//     }
//     jsonData.push({
//         gericht: document.getElementById('create-recipe-name').value,
//         id: id,
//         sort1: document.getElementById('create-recipe-sort1').innerHTML,
//         sort2: document.getElementById('create-recipe-sort2').innerHTML,
//         bild: fileName,
//         categories: [document.getElementById('create-recipe-sort1').value, document.getElementById('create-recipe-sort2').value]
//     })
//     let jsonString = JSON.stringify(jsonData);
//     writeFileSync('rezepte.json', jsonString, 'utf-8', (err) => {
//         if (err) throw err;
//         console.log('Data added to file');
//     })
// }