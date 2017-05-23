var React = require('react'),
Board = require('Board');

//We need this functions because React setState is asynchronous
function incrementNumOfOpenBy(n) {
  return (previousState, currentProps) => {
    return { numOfOpen: previousState.numOfOpen + n };
  };
}

var Game = React.createClass({
  getInitialState: function () {
    return {
      boardHeight: 9,
      boardWidth: 9,
      numOfMines: 10,
      numOfFlags: 10,
      numOfMistakes: 0,
      numOfOpen: 0,
      numOfMineFreeCells: 71,
      gameOn: false,
      lostTheGame: false,
      supermanMode: false,
      cellTable: -1 //Value -1 until first run
    };
  },

  //Returns the cell's info if available or 'false' otherwise
  getCellInfo: function (rowNum, colNum) {
    if(this.state.lostTheGame) return this.state.cellTable[rowNum][colNum];
    if(!this.state.gameOn) return false;
    return this.state.cellTable[rowNum][colNum];
  },

  //Returns 'true' when player loses AND the requested cell has a mine
  showMines: function (rowNum, colNum) {
    if(!this.state.cellTable) return false;
    if(this.state.lostTheGame && this.state.cellTable[rowNum][colNum].hasMine) return true;
    return false;
  },

  //Click+shift handler
  cellFlagClick: function(rowNum, colNum){
    var cellTable = this.state.cellTable,
    numOfFlags = this.state.numOfFlags,
    numOfMistakes = this.state.numOfMistakes,
    hasMine = cellTable[rowNum][colNum].hasMine;

    if(cellTable[rowNum][colNum].isOpen) return;
    if(!cellTable[rowNum][colNum].hasFlag){
      if(this.state.numOfFlags == 0){
        alert("No more flags");
        return;
      }
      //Placing the flag
      cellTable[rowNum][colNum].hasFlag = true;
      numOfFlags--;
      if(!hasMine){
        numOfMistakes++;
        this.setState({numOfMistakes: numOfMistakes});
      }
      //Check for winning - 'All flags in place'
      if(numOfFlags == 0 && numOfMistakes == 0){
        this.setState({gameOn: false});
        alert("YOU WIN!!!");
        return;
      }
    }
    else { //Removing existing flag
      cellTable[rowNum][colNum].hasFlag = false;
      numOfFlags++;
      if(!hasMine){
        this.setState({numOfMistakes: numOfMistakes - 1});
      }
    }
    this.setState({numOfFlags: numOfFlags});
  },

  //Simple-click handler
  cellRegularClick: function(rowNum, colNum){
    var cellTable = this.state.cellTable,
    numOfFlags = this.state.numOfFlags,
    numOfMistakes = this.state.numOfMistakes,
    numOfOpen = this.state.numOfOpen,
    hasMine = cellTable[rowNum][colNum].hasMine,
    leftEnd = true,
    rightEnd = true;

    if(cellTable[rowNum][colNum].isOpen || cellTable[rowNum][colNum].hasFlag) return;
    cellTable[rowNum][colNum].isOpen = true;
    numOfOpen++;
    this.setState(incrementNumOfOpenBy(1)); //We use this function because we need the updated state value in this render iteration
    //Check for losing
    if(hasMine){
      this.setState({gameOn: false});
      this.setState({lostTheGame: true});
      alert("Game Over!");
      return;
    }
    //Check for winning - 'All mine-free cells are open'
    if(numOfOpen == this.state.numOfMineFreeCells){
      this.setState({gameOn: false});
      alert("YOU WIN!!");
      return;
    }
    this.setState({cellTable: cellTable});

    if(cellTable[rowNum][colNum].count != 0) return;

    //If no neighbours with mines around: (updates them recursively. The reason we needed 'incrementNumOfOpenBy')
    if (colNum > 0){
      leftEnd = false;
      this.cellRegularClick(rowNum, colNum - 1);
    }
    if (colNum < this.state.boardWidth - 1){
      rightEnd = false;
      this.cellRegularClick(rowNum, colNum + 1);
    }
    if(rowNum > 0){
      this.cellRegularClick(rowNum -1, colNum);
      if(!leftEnd) this.cellRegularClick(rowNum - 1, colNum - 1);
      if(!rightEnd) this.cellRegularClick(rowNum - 1, colNum + 1);
    }
    if(rowNum < this.state.boardHeight - 1){
      this.cellRegularClick(rowNum + 1, colNum);
      if(!leftEnd) this.cellRegularClick(rowNum + 1, colNum - 1);
      if(!rightEnd) this.cellRegularClick(rowNum + 1, colNum + 1);
    }
  },

  //Returns a shuffled n sized array with the numbers 0..(n-1)
  shuffle: function (n) {
    var i = 0,
    j = 0,
    temp = null,
    array = [];
    for (var i = 0; i < n; i++) {
      array[i] = i;
    }
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array;
  },

  //Sets mines in random cells (uses 'shuffle' as helper)
  setMines: function (cellTable) {
    var boardWidth = this.state.boardWidth,
    boardHeight= this.state.boardHeight,
    numOfMines = this.state.numOfMines,
    shuffledNumbers = this.shuffle(boardWidth * boardHeight),
    mineIndex = shuffledNumbers.slice(0, numOfMines),
    rightEnd = true, leftEnd = true,
    row, col;
    for (var i = 0; i < numOfMines; i++) {
      row = Math.floor(mineIndex[i] / boardWidth);
      col = mineIndex[i] % boardWidth ;
      cellTable[row][col].hasMine = true;
      if (col > 0){
        leftEnd = false;
        cellTable[row][col - 1].count++;
      }
      if (col < boardWidth - 1){
        rightEnd = false;
        cellTable[row][col + 1].count++;
      }
      if(row > 0){
        cellTable[row - 1][col].count++;
        if(!leftEnd) cellTable[row - 1][col - 1].count++;
        if(!rightEnd) cellTable[row - 1][col + 1].count++;
      }
      if(row < boardHeight - 1){
        cellTable[row + 1][col].count++;
        if(!leftEnd) cellTable[row + 1][col - 1].count++;
        if(!rightEnd) cellTable[row + 1][col + 1].count++;
      }
      leftEnd = true;
      rightEnd = true;
    }
    this.setState({cellTable : cellTable});
  },

  //Creates a default-setted table of game-cells
  createTable: function (boardHeight, boardWidth) {
    var plainCellTable = [];
    for (var i = 0 ; i < boardHeight; i++) {
      plainCellTable[i] = [];
      for (var j = 0; j < boardWidth; j++){
        plainCellTable[i][j] = {
          rowNum : i,
          colNum : j,
          count : 0,
          isOpen : false,
          hasMine : false,
          hasFlag : false
        };
      }
    }
    return plainCellTable;
  },

  //Sets the new inputed game settings
  setSettings: function (e) {
    e.preventDefault();
    var boardHeight = parseInt(this.refs.height.value),
    boardWidth = parseInt(this.refs.width.value),
    numOfMines = parseInt(this.refs.mines.value);

    if(isNaN(boardHeight) || boardHeight < 1 || boardHeight > 300){
      alert("'Height' must be a valid number between 1 and 300");
      return;
    }
    if(isNaN(boardWidth) || boardWidth < 1 || boardWidth > 300){
      alert("'Width' must be a valid number between 1 and 300");
      return;
    }
    if(isNaN(numOfMines) || numOfMines < 1 || numOfMines > boardHeight*boardWidth){
      alert("'Number of mines' must be a valid number between 1 and the board's total cell amount");
      return;
    }
    this.setState({gameOn: false});
    this.setState({boardWidth: boardHeight});
    this.setState({boardHeight: boardWidth});
    this.setState({numOfMines: numOfMines});
    this.setState({supermanMode: this.refs.supermanCheck.checked});
  },

  //Initiate a new game
  startGame: function (e) {
    e.preventDefault();
    var boardHeight = this.state.boardHeight,
    boardWidth = this.state.boardWidth,
    numOfMines = this.state.numOfMines,
    numOfCells = boardHeight * boardWidth,
    plainMineTable = this.createTable(boardHeight, boardWidth);
    this.setMines(plainMineTable);
    this.setState({numOfMineFreeCells : (numOfCells - numOfMines)});
    this.setState({numOfFlags : numOfMines});
    this.setState({numOfMistakes : 0});
    this.setState({numOfOpen : 0});
    this.setState({gameOn : true});
    this.setState({lostTheGame : false});
  },

  //Initiate a class of properties to pass on to 'Board' component (and later on to 'Row' and 'Cell' as well)
  createGameSettingsClass: function (){
    return {
      boardHeight: this.state.boardHeight,
      boardWidth: this.state.boardWidth,
      getCellInfo: this.getCellInfo,
      supermanMode: this.state.supermanMode,
      cellRegularClick: this.cellRegularClick,
      cellFlagClick: this.cellFlagClick,
      gameOn: this.state.gameOn,
      showMines: this.showMines
    }
  },

  render: function () {
    var mainMessage, supermanMessage
    mainMessage = this.state.gameOn ? "The game is running!" : "Please click on 'Start Game' to begin the fun";
    supermanMessage = this.state.supermanMode ? "on" : "off";
    var gameSettings = this.createGameSettingsClass();

    return (
      <div>
        <form onSubmit={this.setSettings}>
          <table>
            <tr>
              <td>
                <input ref="height" placeholder="height"/>
                <h3>Height: {this.state.boardHeight}</h3>
              </td>
              <td>
                <input ref="width" placeholder="Width"/>
                <h3>Width: {this.state.boardWidth}</h3>
              </td>
              <td>
                <input ref="mines" placeholder="Number of mines"></input>
                <h3>Mines: {this.state.numOfMines}</h3>
              </td>
              <td>
                <input type="checkbox" ref="supermanCheck" name="superman"></input>
              </td>
              <td><h3>Superman Mode: {supermanMessage}</h3></td>
            </tr>
          </table>
          <button className='mySettingsButton'>Set</button>
        </form>
        <h1 className='topInfo'>{mainMessage}</h1>
        <div className='topInfo'><div className='myButton' onClick={this.startGame}>Start Game!</div></div>
        <h2 className='topInfo'>Flags left: {this.state.numOfFlags}</h2>
        <Board gameSettings={gameSettings}/>
      </div>
    );
  }
});

module.exports = Game;
