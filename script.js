function createPlayer(name, mark) {
  let points = 0;

  function addOnePoint() {
    points++;
  }

  function getPoints() {
    return points;
  }

  return {
    name,
    mark,
    getPoints,
    addOnePoint,
  };
}

const displayController = (function displayController() {
  function appendButtons(cells) {
    let container = document.querySelector(".board-container");
    for (let cell of cells) {
      container.appendChild(cell);
    }
  }

  function styleButton(button, mark) {
    button.style.backgroundImage = `url('${mark}')`;
    button.style.backgroundSize = "cover";
    button.style.backgroundPosition = "center";
    button.style.backgroundRepeat = "no-repeat";
  }

  const errorParagraph = document.querySelector(".error");
  function clearError() {
    errorParagraph.style.display = "none";
  }

  function showCellOcupiedError() {
    errorParagraph.style.display = "block";
    errorParagraph.textContent = "This cell was already used, try another one!";
  }

  function printBoard(board) {
    console.log(`  | 0 | 1 | 2`);
    console.log(`0 | ${board[0][0]} | ${board[0][1]} | ${board[0][2]}`);
    console.log(`0 | ${board[1][0]} | ${board[1][1]} | ${board[1][2]}`);
    console.log(`0 | ${board[2][0]} | ${board[2][1]} | ${board[2][2]}`);
  }

  function showPlayerInput(name, mark, play) {
    console.log(`${name} placed his ${mark} on ${play}`);
  }

  function alertWinner(name) {
    alert(`${name} wins the game!`);
  }

  function showTie() {
    console.log("It is a tie!");
  }

  function showInvalidCoordinatesError() {
    console.log("Invalid board position.");
  }

  function showInvalidInputError() {
    console.log(
      `Your input was invalid, follow the pattern: row, column (ie. 1, 1).`,
    );
  }

  function showPoints(players) {
    console.log(
      `${players[0].name} has ${players[0].getPoints()} points\n${players[1].name} has ${players[1].getPoints()} points`,
    );
  }

  return {
    appendButtons,
    styleButton,
    clearError,
    printBoard,
    showPlayerInput,
    alertWinner,
    showTie,
    showCellOcupiedError,
    showInvalidCoordinatesError,
    showInvalidInputError,
    showPoints,
  };
})();

const board = (function gameBoard() {
  const cells = createCells();
  const marks = ["images/x-marker.png", "images/o-marker.png"];
  let emptySpaces = 9;
  let markIsX = true;

  function createCells() {
    let cells = [];
    for (let i = 0; i < 9; i++) {
      const button = document.createElement("button");
      button.classList.add("board-cell");
      button.id = `${i}`;
      setOnClick(button);
      cells.push(button);
      displayController.appendButtons(cells);
    }
    return cells;
  }

  function setOnClick(button) {
    button.addEventListener("click", (e) => {
      if (button.hasAttribute("data-filled")) {
        displayController.showCellOcupiedError();
        return;
      }

      displayController.clearError();
      updateBoard(button);
    });
  }

  function updateBoard(button) {
    let [markUrl, mark] = markIsX ? [marks[0], "x"] : [marks[1], "o"];
    button.setAttribute("data-filled", "filled");
    button.setAttribute("data-mark", mark);
    displayController.styleButton(button, markUrl);
    markIsX = !markIsX;
    emptySpaces--;
  }

  function resetBoard() {
    board = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
    emptySpaces = 9;
  }

  function getCells() {
    return cells;
  }

  function getCell(coordinates) {
    return board[coordinates];
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
    let cross1 = [cells[0], cells[4], cells[8]];
    let cross2 = [cells[2], cells[4], cells[6]];
    return [cross1, cross2];
  }

  return {
    getCells,
    updateBoard,
    resetBoard,
    getEmptySpaces,
    getCell,
    getLines,
    getColumns,
    getCrosses,
  };
})();

const gameController = (function game() {
  const players = [createPlayer("PlayerX", "X"), createPlayer("PlayerO", "O")];
  let gameIsRunning = true;
  const cells = board.getCell;

  while (gameIsRunning) {
    let roundIsRunning = true;
    let winner;

    for (let player of players) {
      let play = getPlayerInput(player);
      displayController.showPlayerInput(player.name, player.mark, play);
      board.updateBoard(play, player.mark);
      displayController.printBoard(board.getBoard());

      if ((winner = getWinner(player.mark, player.name))) {
        roundIsRunning = false;
        displayController.alertWinner(player.name);
        player.addOnePoint();
        break;
      }

      if (board.getEmptySpaces() == 0) {
        roundIsRunning = false;
        displayController.showTie();
        break;
      }
    }

    if (!roundIsRunning) {
      board.resetBoard();
      let roundWinner = players.find((player) => player.name === winner);
      displayController.showPoints(players);
      displayController.printBoard(board.getBoard());
      roundIsRunning = true;
    }
  }

  function getWinner(mark, name) {
    for (let line of board.getLines()) {
      if (line.every((val) => val === mark)) {
        return name;
      }
    }

    for (let column of board.getColumns()) {
      if (column.every((val) => val === mark)) {
        return name;
      }
    }

    for (let cross of board.getCrosses()) {
      if (cross.every((val) => val === mark)) {
        return name;
      }
    }

    return null;
  }

  function getPlayerInput(player) {
    let moveIsInvalid = true;
    let input;
    let cells = board.getCells();

    while (moveIsInvalid) {
      for (let cell of cells) {
        cell.addEventListener("click", getCellId);
      }

      // if (isValid(input)) {
      //   moveIsInvalid = false;
      //   break;
      // }

      for (let cell of cells) {
        cell.removeEventListener("click", getCellId);
      }
    }

    return [input[0], input[input.length - 1]];
  }

  function getCellId(cell) {
    console.log(cell.id);
  }

  // function isValid(input) {
  //   const regex = /^[0-2], ?[0-2]$/;
  //
  //   if (!input.match(regex)) {
  //     displayController.showInvalidInputError();
  //     return false;
  //   }
  //
  //   let coordinates = [input[0], input[input.length - 1]];
  //
  //   if (!(board.getCell(coordinates) === " ")) {
  //     displayController.showCellOcupiedError();
  //     return false;
  //   }
  //
  //   return true;
  // }
})();
