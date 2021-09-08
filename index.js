// Constants
const WIDTH = 4;

$(function () {
  const board = $("#board");
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
    // TODO: Display score
    score = newScore;
  }

  function moveUp() {
    let hasMoved = false;
    for (let i = WIDTH; i < WIDTH * WIDTH; i++) {
      if (cells[i].innerHTML == "" || cells[i - WIDTH].innerHTML != "")
        continue;

      cells[i - WIDTH].innerHTML = cells[i].innerHTML;
      cells[i].innerHTML = "";
      hasMoved = true;
      if (i >= WIDTH * 2) i -= WIDTH + 1;
    }
    return hasMoved;
  }

  function moveDown() {
    let hasMoved = false;
    for (let i = WIDTH * WIDTH - WIDTH - 1; i >= 0; i--) {
      if (cells[i].innerHTML == "" || cells[i + WIDTH].innerHTML != "")
        continue;

      cells[i + WIDTH].innerHTML = cells[i].innerHTML;
      cells[i].innerHTML = "";
      hasMoved = true;
      if (i < WIDTH * WIDTH - WIDTH * 2) i += WIDTH + 1;
    }
    return hasMoved;
  }

  function moveLeft() {
    let hasMoved = false;
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      if (
        i % WIDTH == 0 ||
        cells[i].innerHTML == "" ||
        cells[i - 1].innerHTML != ""
      )
        continue;
      cells[i - 1].innerHTML = cells[i].innerHTML;
      cells[i].innerHTML = "";
      hasMoved = true;
      i -= 2;
    }
    return hasMoved;
  }

  function moveRight() {
    let hasMoved = false;
    for (let i = WIDTH * WIDTH - 1; i >= 0; i--) {
      if (
        (i + 1) % WIDTH == 0 ||
        cells[i].innerHTML == "" ||
        cells[i + 1].innerHTML != ""
      )
        continue;

      cells[i + 1].innerHTML = cells[i].innerHTML;
      cells[i].innerHTML = "";
      hasMoved = true;
      i += 2;
    }
    return hasMoved;
  }

  function moveVertically(isUp) {
    return isUp ? moveUp() : moveDown();
  }

  function moveHorizontally(isLeft) {
    return isLeft ? moveLeft() : moveRight();
  }

  function combineVertically(isUp) {
    // TODO: Manage priorities of combinations
    let hasMoved = false;
    hasMoved |= moveVertically(isUp);
    for (let i = 0; i < WIDTH * WIDTH - WIDTH; i++) {
      if (
        cells[i].innerHTML == "" ||
        cells[i].innerHTML != cells[i + WIDTH].innerHTML
      )
        continue;

      let newValue = parseInt(cells[i].innerHTML) * 2;
      cells[i].innerHTML = newValue;
      cells[i + WIDTH].innerHTML = "";
      setScore(score + newValue);
      hasMoved = true;
    }
    hasMoved |= moveVertically(isUp);
    return hasMoved;
  }

  function combineHorizontally(isLeft) {
    // TODO: Manage priorities of combinations
    let hasMoved = false;
    hasMoved |= moveHorizontally(isLeft);
    for (let i = 0; i < WIDTH * WIDTH - 1; i++) {
      if (
        cells[i].innerHTML == "" ||
        cells[i].innerHTML != cells[i + 1].innerHTML
      )
        continue;

      let newValue = parseInt(cells[i].innerHTML) * 2;
      cells[i].innerHTML = newValue;
      cells[i + 1].innerHTML = "";
      setScore(score + newValue);
      hasMoved = true;
    }
    hasMoved |= moveHorizontally(isLeft);
    return hasMoved;
  }

  function handleKeyDown(e) {
    let hasMoved = false;
    switch (e.keyCode) {
      case 37: // Left
        hasMoved |= combineHorizontally(true);
        break;
      case 38: // Up
        hasMoved |= combineVertically(true);
        break;
      case 39: // Right
        hasMoved |= combineHorizontally(false);
        break;
      case 40: // Down
        hasMoved |= combineVertically(false);
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
