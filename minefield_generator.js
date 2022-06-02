import Minefield from "./minefield.js"

function random(fieldWidth, fieldHeight, totalMines, except = []){
  let mines = [];
  let retries = 0;
  let maxRetries =fieldWidth * fieldHeight;
  
  while(mines.length < totalMines && retries < maxRetries){
    let mine = {
      x : randomInt(fieldWidth),
      y : randomInt(fieldHeight)
    };
    
    let coordAllowed = hasCoord(mine, except) == false && hasCoord(mine, mines) == false;
    if(coordAllowed){
      mines.push(mine);
      retries = 0;
    }else{
      retries += 1;
    }
  }
  
  return new Minefield(fieldWidth, fieldHeight, mines);
}

function hasCoord(coord, list){
  return Boolean(list.find(c => c.x == coord.x && c.y == coord.y));
}

function randomInt(length){
  return Math.round(Math.random() * length);
}

export default {random}