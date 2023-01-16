var kueh = ["angku", "cendol", "idli", "karipap", "keropok", "lapis", "onde", "pisang", "popiah", "roda"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

var currentTile;
var otherTile;



window.onload = function() {
  const startingMinutes = 1;
  let time = startingMinutes*60;

  const countdownEl = document.getElementById('countdown');



  startGame();
  let refreshIntervalId = window.setInterval(updateCountdown,1000); //update every 1 sec
  //1/10th of a second
  window.setInterval(function(){
    crushKueh();
    slideKueh();
    generateKueh();
  }, 100);

  function updateCountdown(){
    const minutes = Math.floor(time/60); //use floor to retrieve the lowest no
    let seconds = time % 60;

    seconds = seconds < 10? '0'+ seconds:seconds;
    countdownEl.innerHTML = `${minutes}:${seconds}`;
    time--;
    if (time < 0) { //stop the setInterval whe time = 0 for avoid negative time
      clearInterval(refreshIntervalId);
      alert('Game Over!'); // popup message when the timer ends
    }
  }
}




function randomKueh() {
  return kueh[Math.floor(Math.random() * kueh.length)]; //0 - 5.99
}

function startGame() {
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      // <img id="0-0" src="./images/Red.png">
      let tile = document.createElement("img");
      tile.id = r.toString() + "-" + c.toString();
      tile.src = "./images/" + randomKueh() + ".png";

      //DRAG FUNCTIONALITY
      tile.addEventListener("dragstart", dragStart); //click on a kueh, initialize drag process
      tile.addEventListener("dragover", dragOver);  //clicking on kueh, moving mouse to drag the kueh
      tile.addEventListener("dragenter", dragEnter); //dragging kueh onto another kueh
      tile.addEventListener("dragleave", dragLeave); //leave kueh over another kueh
      tile.addEventListener("drop", dragDrop); //dropping a kueh over another kueh
      tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap kueh

      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
  console.log(board);
}

function dragStart() {
  //this refers to tile that was clicked on for dragging
  currentTile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
  //this refers to the target tile that was dropped on
  otherTile = this;
}

function dragEnd() {

  if (currentTile.src.includes("blank") || otherTile.src.includes("blank")) {
    return;
  }

  let currCoords = currentTile.id.split("-"); // id="0-0" -> ["0", "0"]
  let r = parseInt(currCoords[0]);
  let c = parseInt(currCoords[1]);

  let otherCoords = otherTile.id.split("-");
  let r2 = parseInt(otherCoords[0]);
  let c2 = parseInt(otherCoords[1]);

  let moveLeft = c2 == c-1 && r == r2;
  let moveRight = c2 == c+1 && r == r2;

  let moveUp = r2 == r-1 && c == c2;
  let moveDown = r2 == r+1 && c == c2;

  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  if (isAdjacent) {
    let currImg = currentTile.src;
    let otherImg = otherTile.src;
    currentTile.src = otherImg;
    otherTile.src = currImg;

    let validMove = checkValid();
    if (!validMove) {
      let currImg = currentTile.src;
      let otherImg = otherTile.src;
      currentTile.src = otherImg;
      otherTile.src = currImg;
    }
  }
}

function crushKueh() {
  //crushFive();
  //crushFour();
  crushThree();
  document.getElementById("score").innerText = score;

  //do time?


}

function crushThree() {
  //check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns-2; c++) {
      let kueh1 = board[r][c];
      let kueh2 = board[r][c+1];
      let kueh3 = board[r][c+2];
      if (kueh1.src == kueh2.src && kueh2.src == kueh3.src && !kueh1.src.includes("blank")) {
        kueh1.src = "./images/blank.png";
        kueh2.src = "./images/blank.png";
        kueh3.src = "./images/blank.png";
        score += 30;
      }
    }
  }

  //check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows-2; r++) {
      let kueh1 = board[r][c];
      let kueh2 = board[r+1][c];
      let kueh3 = board[r+2][c];
      if (kueh1.src == kueh2.src && kueh2.src == kueh3.src && !kueh1.src.includes("blank")) {
        kueh1.src = "./images/blank.png";
        kueh2.src = "./images/blank.png";
        kueh3.src = "./images/blank.png";
        score += 30;
      }
    }
  }
}

function checkValid() {
  //check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns-2; c++) {
      let kueh1 = board[r][c];
      let kueh2 = board[r][c+1];
      let kueh3 = board[r][c+2];
      if (kueh1.src == kueh2.src && kueh2.src == kueh3.src && !kueh1.src.includes("blank")) {
        return true;
      }
    }
  }

  //check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows-2; r++) {
      let kueh1 = board[r][c];
      let kueh2 = board[r+1][c];
      let kueh3 = board[r+2][c];
      if (kueh1.src == kueh2.src && kueh2.src == kueh3.src && !kueh1.src.includes("blank")) {
        return true;
      }
    }
  }

  return false;
}


function slideKueh() {
  for (let c = 0; c < columns; c++) {
    let ind = rows - 1;
    for (let r = columns-1; r >= 0; r--) {
      if (!board[r][c].src.includes("blank")) {
        board[ind][c].src = board[r][c].src;
        ind -= 1;
      }
    }

    for (let r = ind; r >= 0; r--) {
      board[r][c].src = "./images/blank.png";
    }
  }
}

function generateKueh() {
  for (let c = 0; c < columns; c++) {
    if (board[0][c].src.includes("blank")) {
      board[0][c].src = "./images/" + randomKueh() + ".png";
    }
  }
}
