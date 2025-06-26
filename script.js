const player = function (name, mark) {
  let score = 0;

  function addPoint() {
    score++;
  }

  function getScore() {
    return score;
  }

  function resetScore() {
    score = 0;
  }

  return {
    addPoint,
    getScore,
    resetScore,
    name,
    mark,
  };
};

const formsController = (function () {
  const form = document.querySelector("form");
  let name1;
  let name2;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let formName1 = document.querySelector("input[name=playerx]").value;
    let formName2 = document.querySelector("input[name=playero]").value;

    name1 = formName1.length > 1 ? formName1 : "Player X";
    name2 = formName2.length > 1 ? formName2 : "Player O";

    gameController.setPlayerName(0, name1);
    gameController.setPlayerName(1, name2);

    displayController.updateScores(gameController.getPlayers());
    displayController.closeModal();
    form.reset();
  });

  function setButtons() {
    let changeNameButton = document.querySelector(".change-names");
    changeNameButton.addEventListener("click", () => {
      displayController.showModal();
    });

    let resetScoresButton = document.querySelector(".reset-scores");
    resetScoresButton.addEventListener("click", () => {
      gameController.resetScores();
    });
  }

  setButtons();

  return {
    name1,
    name2,
  };
})();

const displayController = (function display() {
  const board = document.querySelector(".board-container");
  const modal = document.querySelector("[data-modal]");

  function displayBoard(cells) {
    for (let cell of cells) {
      board.appendChild(cell);
    }
  }

  function clearBackgroundImage() {
    board.style.backgroundImage = `url(images/board.png)`;
    board.style.backgroundSize = "cover";
    board.style.backgroundPosition = "center";
    board.style.backgroundRepeat = "no-repeat";
  }

  function drawWinner(direction, number) {
    board.style.backgroundImage = `url(images/${direction}-${number}.png)`;
    board.style.backgroundSize = "cover";
    board.style.backgroundPosition = "center";
    board.style.backgroundRepeat = "no-repeat";
  }

  function showModal() {
    modal.showModal();
  }

  function closeModal() {
    modal.close();
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
      p.textContent = `${player.name} - ${player.getScore()}`;
      ps.push(p);
    }

    return ps;
  }

  document.addEventListener("DOMContentLoaded", () => {
    modal.showModal();
  });

  return {
    displayBoard,
    updateCell,
    showCellFilledError,
    hideErrorParagraph,
    clearBoard,
    updateScores,
    showModal,
    closeModal,
    drawWinner,
    clearBackgroundImage,
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
    const cross1 = [cells[0], cells[4], cells[8]];
    const cross2 = [cells[2], cells[4], cells[6]];
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
  const players = [player("Player X", "x"), player("Player O", "o")];
  displayController.updateScores(players);
  let cells = boardController.getCells();
  let currentMarker = "x";
  let currentMarkerIsX = true;
  let pause = false;

  function game() {
    displayController.updateScores(players);
    for (let cell of cells) {
      cell.addEventListener("click", onClick);
    }
  }

  function onClick(e) {
    if (pause) {
      return;
    }

    let cell = e.target;
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
      pause = true;
      setTimeout(resetGame, 1300);
    }

    if (checkTie()) {
      pause = true;
      setTimeout(resetGame, 1300);
    }
  }

  function resetGame() {
    boardController.resetBoard();
    cells = boardController.getCells();
    currentMarker = "x";
    currentMarkerIsX = true;
    game();
    pause = false;
    displayController.clearBackgroundImage();
  }

  function checkWinner(mark) {
    let lineNumber = 0;
    for (let line of boardController.getLines()) {
      if (checkArray(line, mark)) {
        displayController.drawWinner("line", lineNumber);
        return mark;
      }
      lineNumber++;
    }

    let columnNumber = 0;
    for (let column of boardController.getColumns()) {
      if (checkArray(column, mark)) {
        displayController.drawWinner("column", columnNumber);
        return mark;
      }
      columnNumber++;
    }

    let crossNumber = 0;
    for (let cross of boardController.getCrosses()) {
      if (checkArray(cross, mark)) {
        displayController.drawWinner("cross", crossNumber);
        return mark;
      }
      crossNumber++;
    }

    return null;
  }

  function checkArray(array, mark) {
    let markers = [];
    for (let cell of array) {
      markers.push(cell.dataset.marker);
    }

    if (markers.every((val) => val === mark)) {
      return mark;
    }
  }

  function checkTie() {
    return boardController.getEmptySpaces() === 0;
  }

  function resetScores() {
    for (let player of players) {
      player.resetScore();
    }
    displayController.updateScores(players);
  }

  function setPlayerName(index, name) {
    players[index].name = name;
  }

  function getPlayers() {
    return players;
  }

  game();

  return {
    resetScores,
    setPlayerName,
    getPlayers,
  };
})();
