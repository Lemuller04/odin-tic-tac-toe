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

function gameBoard() {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  function updateBoard(row, column, mark) {
    if (row < 0 || row > 2 || column < 0 || column > 2) {
      console.log("Invalid board position.");
      return;
    }

    board[row][column] = mark;
  }

  function getBoard() {
    return board;
  }

  function resetBoard() {
    board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  }

  return {
    getBoard,
    changeBoard,
    resetBoard,
  };
}
