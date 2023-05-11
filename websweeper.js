const nBombs = 10;
const size = 10;

// TODO: change amount of bombs from web

function initTable(size){
    let table = document.getElementById("websweeper");
    // TODO: catch errors
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
                createdCell.addEventListener('click', cellClick, true);
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
            // console.log(cell);
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
    }
    numberInside.classList.add('formated');
    numberInside.style.color = colors[number-1];
    numberInside.removeEventListener('click', cellClick);
    cell.appendChild(numberInside);
}

function cellClick(e){
    // console.log(e);
    if(e.target.classList.contains('bomb')){
        // TODO: Stop game - lost
        console.log('BOMB!');
    }
    // Reveal number
    else{
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
                console.log('empty cell');
                revealEmptyCells(e.target);

            }
            e.target.children[0].style.opacity = '1';
        }
    }   
}

function revealEmptyCells(cell){
    cell.classList.add('revealed');
    if(cell.innerText !== ''){
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
                console.log("empty nearby:", "r"+i_fin+" c"+j_fin);
                //console.log(nearbyCell[0]);
                revealEmptyCells(nearbyCell[0]);
            }
        }
    }
}


window.onload = () => {
    initTable(size);
}