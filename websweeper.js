const nBombs_easy = 10;
const nbombs_medium = 15;
const nbombs_hard = 20;
const TABLE_SIZE = 800;

const size_easy = 10;
const size_medium = 15;
const size_hard = 25;

let timerInterval, SIZE, NBOMBS;

function initTable(SIZE, NBOMBS) {
      // Clear table if it exists already - used for regenerating
      const table = document.getElementById('websweeper');
      if (table.children) {
            table.innerHTML = '';
      }
      const timer = document.createElement('h3');
      timer.setAttribute('id', 'timerCounter');
      timer.innerText = 'Do not click the bombs! Good Luck!';
      table.appendChild(timer);
      // Overlay - the transparent background behind boxes
      const overlay = document.createElement('div');
      overlay.setAttribute('id', 'overlayBox');
      table.appendChild(overlay);

      // Main menu
      const startMenuBox = document.createElement('div');
      startMenuBox.setAttribute('id', 'mainMenuBox');
      overlay.appendChild(startMenuBox);

      const titleMenuBox = document.createElement('h2');
      titleMenuBox.innerText = 'Welcome to Websweeper!';
      startMenuBox.appendChild(titleMenuBox);

      const settingsForm = document.createElement('form');
      startMenuBox.appendChild(settingsForm);

      const optionsSelect = document.createElement('select');
      optionsSelect.setAttribute('id', 'difficultySelect');
      let lastDifficulty = localStorage.getItem('difficulty');
      // Remember what was last selected
      optionsSelect.addEventListener('change', (e) => {
            const diff = e.target.value;
            localStorage.setItem('difficulty', diff);
      });
      settingsForm.appendChild(optionsSelect);

      // Easy
      const optionEasy = document.createElement('option');
      optionEasy.setAttribute('value', 'easy');
      optionEasy.innerText = 'Easy';
      if (lastDifficulty === 'easy') {
            optionEasy.setAttribute('selected', 'selected');
      }
      optionsSelect.appendChild(optionEasy);

      // Medium
      const optionMedium = document.createElement('option');
      optionMedium.setAttribute('value', 'medium');
      optionMedium.innerText = 'Medium';
      if (lastDifficulty === 'medium') {
            optionMedium.setAttribute('selected', 'selected');
      }
      optionsSelect.appendChild(optionMedium);

      // Hard
      const optionHard = document.createElement('option');
      optionHard.setAttribute('value', 'hard');
      optionHard.innerText = 'Hard';
      if (lastDifficulty === 'hard') {
            optionHard.setAttribute('selected', 'selected');
      }
      optionsSelect.appendChild(optionHard);

      // Start button
      const startBtn = document.createElement('input');
      startBtn.setAttribute('id', 'startBtn');
      startBtn.setAttribute('type', 'submit');
      startBtn.setAttribute('value', 'Start now!');
      settingsForm.addEventListener('submit', start);
      settingsForm.appendChild(startBtn);

      // "You lost" menu
      const lostMenuBox = document.createElement('div');
      lostMenuBox.setAttribute('id', 'lostMenuBox');
      lostMenuBox.style.display = 'none';
      overlay.appendChild(lostMenuBox);

      const titleLostBox = document.createElement('h2');
      titleLostBox.innerText = 'You Lost!';
      lostMenuBox.appendChild(titleLostBox);

      const lostRetryBtn = document.createElement('button');
      lostRetryBtn.setAttribute('id', 'retryBtn');
      lostRetryBtn.innerText = 'Retry';
      lostRetryBtn.addEventListener('click', retry);
      lostMenuBox.appendChild(lostRetryBtn);

      // "You won" menu
      const wonMenuBox = document.createElement('div');
      wonMenuBox.setAttribute('id', 'wonMenuBox');
      wonMenuBox.style.display = 'none';
      overlay.appendChild(wonMenuBox);

      const titleWonBox = document.createElement('h2');
      titleWonBox.innerText = 'You Won!';
      wonMenuBox.appendChild(titleWonBox);

      let titleWonTimer = document.createElement('h3');
      titleWonTimer.setAttribute('id', 'displayedTimer');
      wonMenuBox.appendChild(titleWonTimer);

      const wonRetryBtn = document.createElement('button');
      wonRetryBtn.setAttribute('id', 'retryBtn');
      wonRetryBtn.innerText = 'Retry';
      wonRetryBtn.addEventListener('click', retry);
      wonMenuBox.appendChild(wonRetryBtn);

      document.addEventListener('contextmenu', (e) => {
            if (e.target.id !== 'websweeper') {
                  e.preventDefault();
            }
      });
      genereateTable(SIZE, NBOMBS);
}

function genereateTable(SIZE, NBOMBS) {
      const table = document.getElementById('websweeper');
      const CELL_SIZE = Math.floor(TABLE_SIZE / SIZE);
      if (websweeper) {
            const createdTable = document.createElement('table');
            for (let i = 0; i < SIZE; i++) {
                  const createdRow = document.createElement('tr');
                  for (let j = 0; j < SIZE; j++) {
                        const createdCell = document.createElement('td');
                        createdCell.classList += 'r' + i + ' c' + j;
                        createdCell.style.width = CELL_SIZE + 'px';
                        createdCell.style.height = CELL_SIZE + 'px';
                        // Generate bombs
                        if (Math.random() * 100 > 100 - NBOMBS) {
                              createdCell.innerText = '';
                              createdCell.style.color = 'white';
                              createdCell.classList += ' bomb';
                        }
                        createdCell.addEventListener(
                              'mousedown',
                              cellClick,
                              true
                        );
                        createdRow.appendChild(createdCell);
                  }
                  createdTable.appendChild(createdRow);
            }
            table.appendChild(createdTable);
            fillNumbers(SIZE);
      }
}

function fillNumbers(SIZE) {
      const table = document.getElementById('websweeper');
      if (!table) {
            console.log("Couldn't fill numbers");
            return;
      }
      for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                  const cell = document.getElementsByClassName(
                        'r' + i + ' c' + j
                  );
                  if (cell[0].classList.contains('bomb')) {
                        continue;
                  }
                  let bombsNearby = 0;
                  let nearbyCell;
                  for (let i2 = -1; i2 < 2; i2++) {
                        for (let j2 = -1; j2 < 2; j2++) {
                              let i_fin = i + i2;
                              let j_fin = j + j2;
                              if (
                                    i_fin < 0 ||
                                    i_fin >= SIZE ||
                                    j_fin < 0 ||
                                    j_fin >= SIZE
                              ) {
                                    continue;
                              }
                              nearbyCell = document.getElementsByClassName(
                                    'r' + i_fin + ' c' + j_fin
                              );
                              if (nearbyCell[0].classList.contains('bomb')) {
                                    bombsNearby += 1;
                              }
                        }
                  }
                  const difficulty = localStorage.getItem('difficulty');
                  insertNumber(cell[0], bombsNearby, difficulty);
            }
      }
}

function insertNumber(cell, number, difficulty) {
      colors = [
            '#009ce9',
            '#66ff00',
            '#ff0800',
            '#ffbf00',
            '#ec3bb0',
            '#ee82ee',
      ];

      const numberInside = document.createElement('p');
      if (number) {
            numberInside.innerText = number;
            cell.classList.add('number');
      }
      numberInside.classList.add('formated');
      if (difficulty === 'easy') {
            cell.style.fontSize = '40px';
      } else if (difficulty === 'medium') {
            cell.style.fontSize = '30px';
      } else if (difficulty === 'hard') {
            cell.style.fontSize = '20px';
      }
      numberInside.style.color = colors[number - 1];
      // numberInside.removeEventListener('click', cellClick);
      cell.appendChild(numberInside);
}

function cellClick(e) {
      // Reveal number
      // left click
      if (e.button === 0) {
            if (e.target.classList.contains('bomb')) {
                  lost();
                  return;
            }
            // click on text
            if (e.target.offsetParent.nodeName === 'TD') {
                  e.target.offsetParent.classList.add('revealed');
                  e.target.style.opacity = '1';
            }
            // click on cell
            else {
                  e.target.classList.add('revealed');

                  // For empty cells
                  if (e.target.children[0].innerText === '') {
                        revealEmptyCells(e.target);
                  }
                  e.target.children[0].style.opacity = '1';
            }
      } else if (e.button === 2) {
            // click on text
            if (e.target.offsetParent.nodeName === 'TD') {
                  if (e.target.offsetParent.classList.contains('revealed')) {
                        return;
                  }
                  // enable/disable flagging
                  if (e.target.offsetParent.classList.contains('flagged')) {
                        e.target.offsetParent.classList.remove('flagged');
                  } else {
                        e.target.offsetParent.classList.add('flagged');
                  }
            }
            // click on cell
            else {
                  if (e.target.classList.contains('flagged')) {
                        e.target.classList.remove('flagged');
                  } else {
                        e.target.classList.add('flagged');
                  }
            }
      }
      if (isSolved()) {
            won();
      }
}

function revealEmptyCells(cell) {
      cell.classList.add('revealed');
      if (cell.classList.contains('number')) {
            cell.children[0].style.opacity = '1';
            return;
      }
      let i = cell.classList[0].substring(1) - 0;
      let j = cell.classList[1].substring(1) - 0;
      for (let i2 = -1; i2 < 2; i2++) {
            for (let j2 = -1; j2 < 2; j2++) {
                  let i_fin = i + i2;
                  let j_fin = j + j2;
                  if (
                        i_fin < 0 ||
                        i_fin >= SIZE ||
                        j_fin < 0 ||
                        j_fin >= SIZE
                  ) {
                        continue;
                  }
                  let nearbyCell = document.getElementsByClassName(
                        'r' + i_fin + ' c' + j_fin
                  );
                  if (!nearbyCell[0].classList.contains('revealed')) {
                        revealEmptyCells(nearbyCell[0]);
                  }
            }
      }
}

function isSolved() {
      for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                  const cell = document.getElementsByClassName(
                        'r' + i + ' c' + j
                  );
                  if (
                        (cell[0].classList.contains('bomb') &&
                              cell[0].classList.contains('flagged')) ||
                        cell[0].classList.contains('revealed')
                  ) {
                  } else return false;
            }
      }
      return true;
}

function start(e) {
      e.preventDefault();
      // Starting timer
      timerReset();
      timerStart();

      const difficulty = document.getElementById('difficultySelect').value;
      if (difficulty === 'easy') {
            SIZE = size_easy;
            NBOMBS = nBombs_easy;
      } else if (difficulty === 'medium') {
            SIZE = size_medium;
            NBOMBS = nbombs_medium;
      } else if (difficulty === 'hard') {
            SIZE = size_hard;
            NBOMBS = nbombs_hard;
      }
      initTable(SIZE, NBOMBS);

      document.getElementById('mainMenuBox').style.display = 'none';
      document.getElementById('overlayBox').style.display = 'none';
}

function lost() {
      stopTimer(timerInterval);
      document.getElementById('overlayBox').style.display = 'block';
      document.getElementById('lostMenuBox').style.display = 'block';
}

function retry() {
      window.location.reload();
}

function won() {
      stopTimer(timerInterval);
      displayedTimer = document.getElementById('displayedTimer');
      displayedTimer.innerText = 'Solved in ' + getTimer();
      document.getElementById('overlayBox').style.display = 'block';
      document.getElementById('wonMenuBox').style.display = 'block';
}

let table = document.getElementById('websweeper');

// Timer

let mins = 0,
      secs = 0,
      timerStartedFlag = false;

function timerReset() {
      mins = 0;
      secs = 0;
      timerStartedFlag = false;
}

function getTimer() {
      return (
            mins.toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
            }) +
            ':' +
            secs.toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
            })
      );
}

function timerStart() {
      // The timer above the board
      timerInterval = setInterval(() => {
            increaseTimer(1);
            // We have to select it every timer in order to update
            const timer = document.getElementById('timerCounter');
            timer.innerText = getTimer();
      }, 1000);
}

function stopTimer(timer) {
      clearInterval(timer);
}

function increaseTimer(amount) {
      if (secs + amount < 60) {
            secs++;
      } else {
            mins++;
            secs = 0;
      }
}

window.onload = () => {
      // Getting the last selected dificulty
      if (!localStorage.getItem('difficulty')) {
            localStorage.setItem('difficulty', 'easy');
      }
      initTable(10);
};
