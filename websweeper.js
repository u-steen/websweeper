const nBombs = 2;
const size = 10;

function initTable(size){
    const table = document.getElementById("websweeper");
    // TODO: overlay is not the right word
    // Overlay - the transparent background behind boxes
    const overlay = document.createElement("div");
    overlay.setAttribute("id", 'overlayBox');
    table.appendChild(overlay);

    // Main menu
    const startMenuBox = document.createElement("div");
    startMenuBox.setAttribute("id", "mainMenuBox");
    overlay.appendChild(startMenuBox);

    const titleMenuBox = document.createElement("h2");
    titleMenuBox.innerText = "Welcome to Websweeper!";
    startMenuBox.appendChild(titleMenuBox);

    const startBtn = document.createElement("button");
    startBtn.setAttribute("id", "startBtn");
    startBtn.innerText = "Start now!";
    startBtn.addEventListener('click', start);
    startMenuBox.appendChild(startBtn);

    // "You lost" menu
    const lostMenuBox = document.createElement("div");
    lostMenuBox.setAttribute("id", "lostMenuBox");
    lostMenuBox.style.display = "none";
    overlay.appendChild(lostMenuBox);

    const titleLostBox = document.createElement("h2");
    titleLostBox.innerText = "You Lost!";
    lostMenuBox.appendChild(titleLostBox);

    const lostRetryBtn = document.createElement("button");
    lostRetryBtn.innerText = "Retry";
    lostRetryBtn.addEventListener('click', retry);
    lostMenuBox.appendChild(lostRetryBtn);

    // "You won" menu
    const wonMenuBox = document.createElement("div");
    wonMenuBox.setAttribute("id", "wonMenuBox");
    wonMenuBox.style.display = "none";
    overlay.appendChild(wonMenuBox);

    const titleWonBox = document.createElement("h2");
    titleWonBox.innerText = "You Won! Thank you for playing!";
    wonMenuBox.appendChild(titleWonBox);
    
    const wonRetryBtn = document.createElement("button");
    wonRetryBtn.innerText = "Retry";
    wonRetryBtn.addEventListener('click', retry);
    wonMenuBox.appendChild(wonRetryBtn);


    // De ce merge asa cv???
    document.addEventListener("contextmenu", (e) => {
        if(e.target.id !== 'websweeper'){
            e.preventDefault();
        }
    });
    if(websweeper){
        const createdTable = document.createElement("table");
        for(let i = 0; i < size; i++){
            const createdRow = document.createElement("tr");
            for(let j = 0; j < size; j++){
                const createdCell = document.createElement("td");
                createdCell.classList += "r"+i+" c"+j;
                // Generate bombs
                if(Math.random()*100 > 100-nBombs){
                    createdCell.innerText = '';
                    createdCell.style.color = 'white';
                    createdCell.classList += ' bomb';
                }
                createdCell.addEventListener('mousedown', cellClick, true);
                createdRow.appendChild(createdCell);
            }
            createdTable.appendChild(createdRow);
        }
        table.appendChild(createdTable);
        fillNumbers();
    }

}



function fillNumbers(){
    const table = document.getElementById("websweeper");
    if(!table){
        console.log("Couldn't fill numbers");
        return;
    }
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size ; j++){
            // console.log("caut:", 'r'+i+" c"+j);
            const cell = document.getElementsByClassName("r"+i+" c"+j);
            if(cell[0].classList.contains('bomb')){
                continue;
            }
            let bombsNearby = 0;
            let nearbyCell;
            for(let i2 = -1; i2 < 2; i2++){
                for(let j2 = -1; j2 < 2; j2++){
                    let i_fin = i+i2;
                    let j_fin = j+j2;
                    //console.log("caut", "r"+i_fin+" c"+j_fin);
                    if(i_fin < 0 || i_fin >= size || j_fin < 0 || j_fin >= size){
                        continue;
                    }
                    nearbyCell = document.getElementsByClassName("r"+i_fin+" c"+j_fin);
                    if(nearbyCell[0].classList.contains("bomb")){
                        bombsNearby += 1;
                    }
                }
            }
            insertNumber(cell[0], bombsNearby);
        }
    }   

}

function insertNumber(cell, number){
    colors = ['#009ce9', '#66ff00', '#ff0800', '#ffbf00', '#ec3bb0', '#ee82ee'];
    
    const numberInside = document.createElement('p');
    if(number){
        numberInside.innerText = number;
        cell.classList.add('number');
    }
    numberInside.classList.add('formated');
    numberInside.style.color = colors[number-1];
    // numberInside.removeEventListener('click', cellClick);
    cell.appendChild(numberInside);
}

function cellClick(e){    
    // Reveal number
    // left click
    if(e.button === 0){
        if(e.target.classList.contains('bomb')){
            lost();
            return;
        }
        // click on text
        if(e.target.offsetParent.nodeName === 'TD'){ 
            e.target.offsetParent.classList.add('revealed');
            e.target.style.opacity = '1';
        }
        // click on cell
        else{
            e.target.classList.add('revealed');

            // For empty cells
            if(e.target.children[0].innerText === ''){
                // console.log('empty cell');
                revealEmptyCells(e.target);

            }
            e.target.children[0].style.opacity = '1';
        }
    }
    else if(e.button === 2){
        // click on text
        if(e.target.offsetParent.nodeName === 'TD'){
            if(e.target.offsetParent.classList.contains('revealed')){
                return;
            }
            // enable/disable flagging
            if(e.target.offsetParent.classList.contains('flagged')){
                e.target.offsetParent.classList.remove('flagged');
            }
            else{
                e.target.offsetParent.classList.add('flagged');
            }
        }
        // click on cell
        else{
            if(e.target.classList.contains('flagged')){
                e.target.classList.remove('flagged');
            }
            else{
                e.target.classList.add('flagged');
            }
        }
    }      
    if(isSolved()){
        won();
    }

}
    
function revealEmptyCells(cell){
    cell.classList.add('revealed');
    // cell.style.backgroundColor = 'azure';
    if(cell.classList.contains('number')){
        cell.children[0].style.opacity = '1';
        return;
    }
    console.log(cell);
    // console.log(cell.classList);
    let i = cell.classList[0][1] - 0;
    let j = cell.classList[1][1] - 0;
    console.log(i, j);
    for(let i2 = -1; i2 < 2; i2++){
        for(let j2 = -1; j2 < 2; j2++){
            let i_fin = i+i2;
            let j_fin = j+j2;
            if(i_fin < 0 || i_fin >= size || j_fin < 0 || j_fin >= size){
                continue;
            }
            let nearbyCell = document.getElementsByClassName("r"+i_fin+" c"+j_fin);
            if(!nearbyCell[0].classList.contains('revealed')){
                // console.log("empty nearby:", "r"+i_fin+" c"+j_fin);
                // console.log(nearbyCell[0]);
                revealEmptyCells(nearbyCell[0]);
            }
        }
    }
}

function isSolved(){
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size ; j++){
            const cell = document.getElementsByClassName("r"+i+" c"+j);
            if((cell[0].classList.contains('bomb') && (cell[0].classList.contains('flagged'))) 
                || cell[0].classList.contains('revealed')){
                console.log('casuta', i, j, 'casuta rezolvata');
            }
            else 
                return false;
        }
    }
    return true;
}

function start(){
    console.log("Game started!");
    document.getElementById("mainMenuBox").style.display = "none";
    document.getElementById("overlayBox").style.display = "none";

}

function lost(){
    console.log("You lost!");
    document.getElementById("overlayBox").style.display = "block";
    document.getElementById("lostMenuBox").style.display = "block";
}

function retry(){
    window.location.reload();
    // TODO: reset table
}

function won(){
    console.log("You won!");
    document.getElementById("overlayBox").style.display = "block";
    document.getElementById("wonMenuBox").style.display = "block";
}

let table = document.getElementById("websweeper");

window.onload = () => {
    initTable(size);
}