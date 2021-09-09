// Constants
const WIDTH = 4;

$(function () {
  const board = document.getElementById("board");
  const scoreSpan = document.getElementById("score");
  const bestSpan = document.getElementById("best");
  let best = 0;
  let score = 0;
  let cells = [];

  function updateCellColors() {
    for (let i = 0; i < cells.length; i++) {
      let color = "rgba(68, 50, 31, 0.35)";
      switch (cells[i].innerHTML) {
        case "2":
          color = "rgb(68, 50, 31)";
          break;
        case "4":
          color = "rgb(85, 66, 28)";
          break;
        case "8":
          color = "rgb(152, 78, 14)";
          break;
        case "16":
          color = "rgb(170, 65, 11)";
          break;
        case "32":
          color = "rgb(173, 41, 10)";
          break;
        case "64":
          color = "rgb(199, 44, 10)";
          break;
        case "128":
          color = "rgb(156, 122, 20)";
          break;
        case "256":
          color = "rgb(169, 133, 19)";
          break;
        case "512":
          color = "rgb(181, 143, 19)";
          break;
        case "1024":
          color = "rgb(194, 154, 18)";
          break;
        case "2048":
          color = rgb(206, 164, 18);
          break;
        case "4096":
          color = rgb(218, 175, 17);
          break;
        case "8192":
          color = rgb(229, 185, 17);
          break;
        case "16384":
          color = rgb(240, 196, 16);
          break;
        case "32768":
          color = rgb(251, 206, 16);
          break;
        case "65536":
        case "131072":
          color = rgb(255, 217, 15);
          break;
      }
      cells[i].style.backgroundColor = color;
    }
  }

  function createBoard() {
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      cell = document.createElement("div");
      cell.innerHTML = "";
      board.append(cell);
      cells.push(cell);
    }

    generateNewCell();
    generateNewCell();
    updateCellColors();
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
      updateCellColors();
    }
  }

  // Game logic
  createBoard();
  document.addEventListener("keydown", handleKeyDown);
});
