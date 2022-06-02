'use strict';
import MinefieldGenerator from './minefield_generator.js'

let width = 14;
let height = 18;
let totalMines = 20; 
let gameWon;
let minefield = null; // will be created first time a cell is clicked
init(width, height);

function init(width, height){
  let grid = document.createElement("div");
  grid.className = "grid";
  grid.style.gridTemplateColumns = `repeat(${width}, 7vmin)`;
  grid.style.gridTemplateRows = `repeat(${height}, 7vmin)`;
  
  for(let x = 0; x < width; x++){
    for(let y = 0; y < height; y++){
      let gridCell = createGridCell(x, y);
      handleEvents(gridCell, x, y);
      grid.appendChild(gridCell);
    }
  }

  let container = document.querySelector('#gridContainer');
  container.appendChild(grid);
}


function createGridCell(x, y){
  let gridCell = document.createElement("div");
  gridCell.className = "grid-cell";
  gridCell.style.gridColumn = x + 1;
  gridCell.style.gridRow = y + 1;
  gridCell.id = toIndex(x, y);
  return gridCell;
}


function handleEvents(gridCell, x, y){
  gridCell.onpointerup = (evt) => {
    if(minefield == null){
      initializeMinefieldFrom(x, y);
    }
    
    if(gameWon == undefined){
      minefield.touchCell(x, y);
      updateGameState();
    }
  };
}


function updateGameState(){
  if(minefield.isSolved()){
    alert("You Won");
    gameWon = true;
  }
  else if(minefield.hasExploded()){
    alert("You Lost");
    gameWon = false;
  }
}


function initializeMinefieldFrom(x, y){
  let except = coordsAround(x, y);
  minefield = MinefieldGenerator.random(width, height, totalMines, except);
  minefield.addCellChangeListener(onCellChanged);
}


function coordsAround(coordX, coordY){
  let coords = [];
  for(let x = -1; x < 2; x++){
    for(let y = -1; y < 2; y++){
      coords.push({x: coordX + x, y: coordY + y});
    }
  }
  return coords; 
}

// Called whenever a cell on minefield changes
function onCellChanged(cell){
  
  let cellElementId = toIndex(cell.getX(), cell.getY());
  let cellElement = document.getElementById(cellElementId);
  cellElement.className = "grid-cell";
  
  if(cell.isRevealed()){
    cellElement.className += " reveal";
    let count = cell.getNeighborMineCount();
    let countText = (count > 0)? count : "";
    cellElement.innerText = countText;
    cellElement.className += " color" + countText;
  }
}


function toIndex(x, y){
  return "Cell" + x + "-" + y;
}