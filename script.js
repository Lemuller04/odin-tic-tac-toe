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
  function printBoard(board) {
    console.log(`  | 0 | 1 | 2`);
    console.log(`0 | ${board[0][0]} | ${board[0][1]} | ${board[0][2]}`);
    console.log(`0 | ${board[1][0]} | ${board[1][1]} | ${board[1][2]}`);
    console.log(`0 | ${board[2][0]} | ${board[2][1]} | ${board[2][2]}`);
  }

  function showLineSeparator() {
    console.log("**************************");
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

  function showCellOcupiedError() {
    console.log("This cell is alread ocupied, try another one.");
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
    printBoard,
    showLineSeparator,
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
  let board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];
  let emptySpaces = 9;

  function updateBoard(coordinates, mark) {
    if (
      coordinates[0] < 0 ||
      coordinates[0] > 2 ||
      coordinates[1] < 0 ||
      coordinates[1] > 2
    ) {
      displayController.showInvalidCoordinatesError();
      return;
    }

    board[coordinates[0]][coordinates[1]] = mark;
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

  function getBoard() {
    return board;
  }

  function getCell(coordinates) {
    return board[coordinates[0]][coordinates[1]];
  }

  function getEmptySpaces() {
    return emptySpaces;
  }

  function getLines() {
    return [board[0], board[1], board[2]];
  }

  function getColumns() {
    let column1 = [board[0][0], board[1][0], board[2][0]];
    let column2 = [board[0][1], board[1][1], board[2][1]];
    let column3 = [board[0][2], board[1][2], board[2][2]];
    return [column1, column2, column3];
  }

  function getCrosses() {
    let cross1 = [board[0][0], board[1][1], board[2][2]];
    let cross2 = [board[0][2], board[1][1], board[2][0]];
    return [cross1, cross2];
  }

  return {
    getBoard,
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

  displayController.printBoard(board.getBoard());

  while (gameIsRunning) {
    let roundIsRunning = true;
    let winner;

    for (let player of players) {
      displayController.showLineSeparator();
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

    while (moveIsInvalid) {
      input = prompt(
        `${player.name}, where would you like to place your ${player.mark}? (ex: 1, 1)`,
      );

      if (isValid(input)) {
        moveIsInvalid = false;
        break;
      }
    }

    return [input[0], input[input.length - 1]];
  }

  function isValid(input) {
    const regex = /^[0-2], ?[0-2]$/;

    if (!input.match(regex)) {
      displayController.showInvalidInputError();
      return false;
    }

    let coordinates = [input[0], input[input.length - 1]];

    if (!(board.getCell(coordinates) === " ")) {
      displayController.showCellOcupiedError();
      return false;
    }

    return true;
  }
})();
