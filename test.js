const player = function (name, mark) {
  let score = 0;

  function addPoint() {
    score++;
  }

  function getScore() {
    return score;
  }

  return {
    addPoint,
    getScore,
    name,
    mark,
  };
};

const displayController = (function display() {
  const board = document.querySelector(".board-container");

  function displayBoard(cells) {
    for (let cell of cells) {
      board.appendChild(cell);
    }
  }

  function clearBoard() {
    clearContainer(board);
  }

  function clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function updateCell(cell, mark) {
    cell.style.backgroundImage = `url(images/${mark}-marker.png)`;
    cell.style.backgroundSize = "cover";
    cell.style.backgroundPosition = "center";
    cell.style.backgroundRepeat = "no-repeat";
  }

  function getErrorParagraph() {
    return document.querySelector(".error");
  }

  function showCellFilledError() {
    const p = getErrorParagraph();
    p.textContent = "This cell is already filled, try another one!";
    p.style.display = "block";
  }

  function hideErrorParagraph() {
    getErrorParagraph().style.display = "none";
  }

  function updateScores(players) {
    const scores = document.querySelector(".scores-container");
    clearContainer(scores);
    let ps = scoresParagraphs(players);
    for (let p of ps) {
      scores.appendChild(p);
    }
  }

  function scoresParagraphs(players) {
    let ps = [];

    for (let player of players) {
      const p = document.createElement("p");
      p.textContent = `${player.name} has ${player.getScore()} points`;
      ps.push(p);
    }

    return ps;
  }

  return {
    displayBoard,
    updateCell,
    showCellFilledError,
    hideErrorParagraph,
    clearBoard,
    updateScores,
  };
})();

const boardController = (function board() {
  let cells = [];
  let emptySpaces = 9;

  function resetBoard() {
    cells = [];
    displayController.clearBoard();
    createCells();
    displayController.displayBoard(cells);
    emptySpaces = 9;
  }

  function createCells() {
    for (let i = 0; i < 9; i++) {
      let cell = createCell(i);
      cells.push(cell);
    }
  }

  function createCell(cellId) {
    let button = document.createElement("button");
    button.id = cellId;
    button.classList.add("board-cell");
    return button;
  }

  function fillCell(cell, mark) {
    emptySpaces--;
    cell.setAttribute("data-filled", "filled");
    cell.setAttribute("data-marker", mark);
  }

  function isFilled(cell) {
    return cell.hasAttribute("data-filled");
  }

  function getCells() {
    return cells;
  }

  function getEmptySpaces() {
    return emptySpaces;
  }

  function getLines() {
    const line1 = [cells[0], cells[1], cells[2]];
    const line2 = [cells[3], cells[4], cells[5]];
    const line3 = [cells[6], cells[7], cells[8]];
    return [line1, line2, line3];
  }

  function getColumns() {
    const column1 = [cells[0], cells[3], cells[6]];
    const column2 = [cells[1], cells[4], cells[7]];
    const column3 = [cells[2], cells[5], cells[8]];
    return [column1, column2, column3];
  }

  function getCrosses() {
    cross1 = [cells[0], cells[4], cells[8]];
    cross2 = [cells[2], cells[4], cells[6]];
    return [cross1, cross2];
  }

  createCells();
  displayController.displayBoard(cells);

  return {
    getCells,
    isFilled,
    getEmptySpaces,
    fillCell,
    getLines,
    getColumns,
    getCrosses,
    resetBoard,
  };
})();

const gameController = (function () {
  const players = [player("Name", "x"), player("Nome", "o")];
  let cells = boardController.getCells();
  let currentMarker = "x";
  let currentMarkerIsX = true;

  function game() {
    displayController.updateScores(players);
    for (let cell of cells) {
      cell.addEventListener("click", () => {
        if (boardController.isFilled(cell)) {
          displayController.showCellFilledError();
          return;
        }
        displayController.hideErrorParagraph();

        let mark = currentMarkerIsX ? "x" : "o";
        currentMarkerIsX = !currentMarkerIsX;

        boardController.fillCell(cell, mark);
        displayController.updateCell(cell, mark);

        if (checkWinner(mark)) {
          let winner = mark === "x" ? 0 : 1;
          players[winner].addPoint();
          resetGame();
        }

        if (checkTie()) {
          resetGame();
        }
      });
    }
  }

  function resetGame() {
    boardController.resetBoard();
    cells = boardController.getCells();
    currentMarker = "x";
    currentMarkerIsX = true;
    game();
  }

  function checkWinner(mark) {
    for (let line of boardController.getLines()) {
      if (checkArray(line, mark)) {
        return mark;
      }
    }

    for (let column of boardController.getColumns()) {
      if (checkArray(column, mark)) {
        return mark;
      }
    }

    for (let cross of boardController.getCrosses()) {
      if (checkArray(cross, mark)) {
        return mark;
      }
    }

    return null;
  }

  function checkArray(array, mark) {
    let markers = [];
    for (cell of array) {
      markers.push(cell.dataset.marker);
    }

    if (markers.every((val) => val === mark)) {
      return mark;
    }
  }

  function checkTie() {
    return boardController.getEmptySpaces() === 0;
  }

  game();
})();
