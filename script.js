function createPlayer(name, mark) {
  let points = 0;

  function addOnePoint() {
    points++;
  }

  function getPoints() {
    return points;
  }

  return { getPoints, name, mark, addOnePoint };
}
