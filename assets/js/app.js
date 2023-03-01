// Récupération des éléments du DOM nécessaires :
const body = document.querySelector("body");
const links = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");
const dimensionSelect = document.getElementById("dimension");
const convertButton = document.getElementById("convertButton");

// Création de la variable pour l'historique
let history = [];

// Fonction de conversion des coordonnées
function convertCoords(event) {

    event.preventDefault()

    // Récupération des coordonnées et de la dimension sélectionnée
    const coordX = Number(document.getElementById("coordX").value);
    const coordZ = Number(document.getElementById("coordZ").value);
    const selectedDimension = dimensionSelect.value;

    // Vérification que les coordonnées sont valides
    if ((coordX) == "" || (coordZ) == "") {
        document.getElementById("result").textContent = "Veuillez saisir des coordonnées valides.";
        return;
    }

    // Création des variables pour stocker la recherche "search" et le résultat "result" de la dernière conversion
    let search;
    let result;

    // Si la dimension choisie est "overworld" alors :
    if (selectedDimension === "overworld")
    {
        // On convertit en coordonnées du Nether
        const netherX = Math.floor(coordX / 8);
        const netherZ = Math.floor(coordZ / 8);

        search = {
            overworldX : coordX,
            overworldZ : coordZ,

            // On récupère le résultat afin de pouvoir l'afficher plus tard dans notre historique
            netherX : netherX,
            netherZ : netherZ
        }

        // Puis on affiche le résultat 
        result = `Nether : X : ${netherX} , Z : ${netherZ}`;
    }

    // Sinon si c'est la dimension du "nether" qui est choisie alors :
    else if (selectedDimension === "nether")
    {
        // On convertit en coordonnées de l'overworld
        const overworldX = coordX * 8;
        const overworldZ = coordZ * 8;
        
        search = {
            netherX : coordX,
            netherZ : coordZ,

            // On récupère le résultat afin de pouvoir l'afficher plus tard dans notre historique
            overworldX : overworldX,
            overworldZ : overworldZ
            
        }

        // Puis on affiche le résultat 
        result = `Overworld : X : ${overworldX} , Z : ${overworldZ}`;
    }

    // Affichage du résultat
    document.getElementById("result").textContent = result;

    // Stockage du résultat de la conversion dans l'historique
    history.unshift(search);

    // Vider les champs des coordonnées
    document.getElementById("coordX").value = "";
    document.getElementById("coordZ").value = "";

    // Mise à jour du tableau
    updateHistoryTable();
}

// Fonction pour mettre à jour la liste de l'historique
function updateHistoryTable() {

    // Récupération du `tbody`
    const historyTableBody = document.getElementById("historyTableBody");

    // Afin d'afficher les numéros des recherches dans l'ordre décroissant :
    // On crée la variable count qui va récupèrer le nombre de recherches
    let count = history.length;

    // Suppression de toutes les recherches existantes du tableau (afin d'éviter les répétitions)
    historyTableBody.innerHTML = "";

    // Ajout des recherches de l'historique à la liste
    for (let i = 0; i < history.length; i++) {
        
        // Création d'une nouvelle ligne dans le corps du tableau
        const historyRow = historyTableBody.insertRow();
    
        // Ajout du numéro de recherche dans la première colonne
        const searchNumberCell = historyRow.insertCell();
        searchNumberCell.textContent = `N° ${count--}`;
        searchNumberCell.setAttribute('data-label', 'Recherche');
    
        // Ajout des coordonnées Overworld dans les colonnes 2 et 3
        const overworldXCell = historyRow.insertCell();
        overworldXCell.textContent = history[i].overworldX;
        overworldXCell.setAttribute('data-label', 'Overworld X');
    
        const overworldZCell = historyRow.insertCell();
        overworldZCell.textContent = history[i].overworldZ;
        overworldZCell.setAttribute('data-label', 'Overworld Z');
    
        // Ajout des coordonnées Nether dans les colonnes 4 et 5
        const netherXCell = historyRow.insertCell();
        netherXCell.textContent = history[i].netherX;
        netherXCell.setAttribute('data-label', 'Nether X');
    
        const netherZCell = historyRow.insertCell();
        netherZCell.textContent = history[i].netherZ;
        netherZCell.setAttribute('data-label', 'Nether Z');
    }
}

// Fonction de changement d'arrière-plan
function changeBackground(selectedDimension, button) {

    // En fonction de la dimension choisie 
    // On change l'image d'arrière-plan du `body`,
    // L'image d'arrière-plan du `bouton`,
    // Ainsi que notre `logo`
    if (selectedDimension === "overworld") 
    {
        body.style.background = "url('assets/img/overworld.jpg') no-repeat center center / cover";
        button.style.background = "url('assets/img/nether.jpg') no-repeat center center / cover";
        document.getElementById("logo").src="assets/img/logoOverworld.png";
    } 
    else if (selectedDimension === "nether") 
    {
        body.style.background = "url('assets/img/nether.jpg') no-repeat center center / cover";
        button.style.background = "url('assets/img/overworld.jpg') no-repeat center center / cover";
        document.getElementById("logo").src="assets/img/logoNether.png";
    }
    
    // Vider les champs des coordonnées et le résultat
    document.getElementById("coordX").value = "";
    document.getElementById("coordZ").value = "";
    document.getElementById("result").textContent = ""; 
}

// Boucle pour gérer la classe CSS `hidden`
links.forEach((link) => {
    link.addEventListener("click", () => {
    
        // Récupération de la valeur de l'attribut "data-section" de l'élément HTML `a` (link)
        const sectionId = link.dataset.section;

        // Sélection d'un élément HTML dans le document qui correspond à l'identifiant stocké dans la variable `sectionId`
        const targetSection = document.querySelector(`#${sectionId}`);
    
        // Ajout de la classe CSS "hidden" à toutes les sections HTML existantes dans le document
        sections.forEach((section) => {
            section.classList.add("hidden");
        });
    
        // Suppression de la classe CSS "hidden" de l'élément HTML sélectionné correspondant à `sectionId`
        targetSection.classList.remove("hidden");

        // Si `sectionId` est égal à "history" :
        // On ajoute la classe CSS "end" à l'élément `body`,
        // Puis on change la source de l'image pour le logo
        if (sectionId === "history") {
            body.classList.add("end");
            document.getElementById("logo").src="assets/img/logoEnd.png";
        }
        // Sinon, en fonction de la dimension choisie, 
        // On supprime la classe CSS "end" de l'élément `body` 
        // Puis on change la source de l'image pour le logo
        else if(dimensionSelect.value == 'overworld')
        {
            body.classList.remove("end");
            document.getElementById("logo").src="assets/img/logoOverworld.png";
        }
        else if(dimensionSelect.value == 'nether'){
            body.classList.remove("end");
            document.getElementById("logo").src="assets/img/logoNether.png";
        }
    })
});

// Ajout des gestionnaires d'événements pour le bouton de conversion et la sélection de dimension
convertButton.addEventListener('click', convertCoords);
dimensionSelect.addEventListener('change', () => {
    changeBackground(dimensionSelect.value, convertButton);
});

// Fonction pour afficher l'année en cours
function getCurrentYear (){

    // Création d'une nouvelle instance de la classe Date
    let date = new Date();
    
    // Récupération de l'élément HTML correspondant à l'ID "copyright"
    const copyright = document.getElementById('copyright');
    
    // Récupération de l'année actuelle en utilisant la méthode getFullYear de l'objet Date
    date = date.getFullYear();
    
    // Modification du texte de l'élément HTML récupéré précédemment pour y insérer l'année actuelle
    return copyright.innerText = date;
}

getCurrentYear();