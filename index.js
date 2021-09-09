// Constants
const WIDTH = 4;
const CELL_VALUES = [
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
  65536, 131072,
];

$(function () {
  const board = document.getElementById("board");
  const scoreSpan = document.getElementById("score");
  const bestSpan = document.getElementById("best");
  let best = 0;
  let score = 0;
  let cells = [];

  function updateCellStyles() {
    for (let i = 0; i < cells.length; i++) {
      cells[i].className = "cell" + cells[i].innerHTML;
    }
  }

  function createBoard() {
    setScore(0);
    cells = [];
    board.innerHTML = "";
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      cell = document.createElement("div");
      cell.innerHTML = "";
      board.append(cell);
      cells.push(cell);
    }

    generateNewCell();
    generateNewCell();
    updateCellStyles();
  }

  function gameOver() {
    console.log("Game over");
  }

  function getEmptyCellsIndexes() {
    return cells.reduce(
      (emptyCells, cell, index) => (
        cell.innerHTML == "" && emptyCells.push(index), emptyCells
      ),
      []
    );
  }

  function generateNewCell() {
    let emptyCells = getEmptyCellsIndexes();

    if (emptyCells.length == 0) {
      gameOver();
      return;
    }

    // Generate new cell
    // TODO: Add higher base numbers according to current score
    let randomId = Math.floor(Math.random() * emptyCells.length);
    cells[emptyCells[randomId]].innerHTML = 2;
  }

  function setScore(newScore) {
    score = newScore;
    scoreSpan.innerHTML = score;
    if (score > best) {
      best = score;
      bestSpan.innerHTML = best;
    }
  }

  function combineCells(originIndex, targetIndex) {
    let newValue = parseInt(cells[targetIndex].innerHTML) * 2;
    cells[targetIndex].innerHTML = newValue;
    cells[originIndex].innerHTML = "";
    setScore(score + newValue);
  }

  function moveCells(originIndex, targetIndex) {
    cells[targetIndex].innerHTML = cells[originIndex].innerHTML;
    cells[originIndex].innerHTML = "";
  }

  function moveUp() {
    let hasMoved = false;
    let combinedIndexes = [];

    for (let i = WIDTH; i < WIDTH * WIDTH; ) {
      if (
        cells[i].innerHTML != "" &&
        cells[i].innerHTML == cells[i - WIDTH].innerHTML &&
        !combinedIndexes.includes(i - WIDTH)
      ) {
        combineCells(i, i - WIDTH);
        combinedIndexes.push(i - WIDTH);
        hasMoved = true;
      } else if (cells[i].innerHTML != "" && cells[i - WIDTH].innerHTML == "") {
        moveCells(i, i - WIDTH);
        hasMoved = true;
        if (i >= WIDTH * 2) i -= WIDTH;
      } else {
        i += WIDTH;
        if (i >= WIDTH * WIDTH && i != WIDTH * WIDTH + WIDTH - 1)
          i -= WIDTH * WIDTH - WIDTH - 1;
      }
    }
    return hasMoved;
  }

  function moveDown() {
    let hasMoved = false;
    let combinedIndexes = [];

    for (let i = WIDTH * WIDTH - WIDTH - 1; i >= 0; ) {
      if (
        cells[i].innerHTML != "" &&
        cells[i].innerHTML == cells[i + WIDTH].innerHTML &&
        !combinedIndexes.includes(i + WIDTH)
      ) {
        combineCells(i, i + WIDTH);
        combinedIndexes.push(i + WIDTH);
        hasMoved = true;
      } else if (cells[i].innerHTML != "" && cells[i + WIDTH].innerHTML == "") {
        moveCells(i, i + WIDTH);
        hasMoved = true;
        if (i < WIDTH * WIDTH - WIDTH * 2) i += WIDTH;
      } else {
        i -= WIDTH;
        if (i < 0 && i != -WIDTH) i += WIDTH * WIDTH - WIDTH - 1;
      }
    }
    return hasMoved;
  }

  function moveLeft() {
    let hasMoved = false;
    let combinedIndexes = [];

    for (let i = 0; i < WIDTH * WIDTH; i++) {
      if (i % WIDTH == 0 || cells[i].innerHTML == "") continue;

      if (
        cells[i].innerHTML == cells[i - 1].innerHTML &&
        !combinedIndexes.includes(i - 1)
      ) {
        combineCells(i, i - 1);
        combinedIndexes.push(i - 1);
        hasMoved = true;
      } else if (cells[i - 1].innerHTML == "") {
        moveCells(i, i - 1);
        hasMoved = true;
        i -= 2;
      }
    }
    return hasMoved;
  }

  function moveRight() {
    let hasMoved = false;
    let combinedIndexes = [];

    for (let i = WIDTH * WIDTH - 1; i >= 0; i--) {
      if ((i + 1) % WIDTH == 0 || cells[i].innerHTML == "") continue;

      if (
        cells[i].innerHTML == cells[i + 1].innerHTML &&
        !combinedIndexes.includes(i + 1)
      ) {
        combineCells(i, i + 1);
        combinedIndexes.push(i + 1);
        hasMoved = true;
      } else if (cells[i + 1].innerHTML == "") {
        moveCells(i, i + 1);
        hasMoved = true;
        i += 2;
      }
    }
    return hasMoved;
  }

  function handleKeyDown(e) {
    let hasMoved = false;
    switch (e.keyCode) {
      case 37: // Left
        hasMoved |= moveLeft();
        break;
      case 38: // Up
        hasMoved |= moveUp();
        break;
      case 39: // Right
        hasMoved |= moveRight();
        break;
      case 40: // Down
        hasMoved |= moveDown();
        break;
    }
    if (hasMoved) {
      generateNewCell();
      updateCellStyles();
    }
  }

  // Game logic
  createBoard();
  document.addEventListener("keydown", handleKeyDown);
  document.getElementById("newGame").addEventListener("click", function () {
    createBoard();
  });
});
