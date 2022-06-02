
class Cell{
  constructor(x, y, neighborMineCount = 0){
    this._x = x;
    this._y = y;
    this._neighborMineCount = neighborMineCount;
    this._isRevealed = false;
  }
  
  getX(){
    return this._x;
  }
  
  getY(){
    return this._y;
  }
  
  isRevealed(){
    return this._isRevealed;
  }
  
  getNeighborMineCount(){
    return this._neighborMineCount;
  }
  
}

export default class Minefield {
  constructor(width = 10, height = 10, mines = []) {
    this._width = width;
    this._height = height;
    this._mines = mines;
    this._cells = this._createCells(mines);
    this._isSolved = false;
    this._hasExploded = false;
    this._revealedCellsCount = 0;
    this._cellChangeListeners = [];
  }

  touchCell(x, y) {
    if(this._hasMine(x, y)){
      this._hasExploded = true;
      return null;
    }
    
    let revealedCells = [];
    let reveal = (cell) => {
      cell._isRevealed = true;
      this._onCellChanged(cell);
      revealedCells.push(cell);
      
      // if its forst time touvhing a cell, reveal anyway
      if(cell.getNeighborMineCount() > 0){
        return;
      }
      
      this._loopAround(cell.getX(), cell.getY(), (nx, ny) => {
        let neighborCell = this.getCell(nx, ny);
        if(neighborCell == null || this._hasMine(nx, ny)){
          return;
        }
        if(neighborCell.isRevealed()){
          return;
        }
        reveal(neighborCell);
      });
    };
    
    let cell = this.getCell(x, y);
    if(cell.isRevealed() == false){
      reveal(cell);
      this._revealedCellsCount += revealedCells.length;
    }
    
    return revealedCells;
  }

  getCell(x, y) {
    return this._cells[x][y];
  }

  getWidth() {
    return this._width;
  }

  getHeight() {
    return this._height;
  }

  hasExploded() {
    return this._hasExploded;
  }

  isSolved() {
    let totalCells = this.getWidth() * this.getHeight();
    let unrevealedCellsCount = totalCells - this._revealedCellsCount;
    let onlyMinesRemain = unrevealedCellsCount == this._mines.length;
    return onlyMinesRemain;
  }
  
  addCellChangeListener(callback){
    if(this._cellChangeListeners.find(c => c == callback)){
      return;
    }
    
    this._cellChangeListeners.push(callback);
  }
  
  _onCellChanged(cell){
    if(cell){
      this._cellChangeListeners.forEach(callback => {
        callback(cell);
      });
    }
  }
  
  _createCells(mines) {
    let cells = [];

    for (let x = 0; x < this.getWidth(); x++) {
      cells.push(Array(this.getHeight()));
      for (let y = 0; y < this.getHeight(); y++) {
        let minesAroundCell = this._countMinesAround(x, y);
        let cell = new Cell(x, y, minesAroundCell);
        cells[x][y] = cell;
      }
    }
    return cells;
  }

  _countMinesAround(coordX, coordY) {
    let count = 0;
    this._loopAround(coordX, coordY, (x, y) => {
      if (this._hasMine(x, y)) {
        count += 1;
      }
    });
    return count;
  }

  _loopAround(x, y, callback) {
    for (let ix = -1; ix < 2; ix++) {
      for (let iy = -1; iy < 2; iy++) {
        if (ix == 0 && iy == 0) {
          continue;
        }
        let neighborX = x + ix;
        let neighborY = y + iy;
        if(this._isCoordinateWithinBounds(neighborX, neighborY)){
          callback(neighborX, neighborY);
        }
      }
    }
  }
  
  _isCoordinateWithinBounds(x, y){
    let withinX = x >= 0 && x < this.getWidth();
    let withinY = y >= 0 && y < this.getHeight();
    return (withinX && withinY);
  }
  
  _hasMine(x, y){
    let mine = this._mines.find(m => m.x == x && m.y == y);
    return Boolean(mine);
  }
  
}