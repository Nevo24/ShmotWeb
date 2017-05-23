var React = require('react');

var Cell = React.createClass({

  //Handel cell clicks
  cellClick: function (e) {
    var gameSettings = this.props.gameSettings;
    if(!gameSettings.gameOn){
      alert("Please start the game first");
      return;
    }
    if (e.shiftKey) { //Handel shift-click
      gameSettings.cellFlagClick(this.props.rowNum, this.props.colNum);
      return;
    }
    gameSettings.cellRegularClick(this.props.rowNum, this.props.colNum);
  },

  render: function () {
    var getCellInfo = this.props.gameSettings.getCellInfo(this.props.rowNum, this.props.colNum),
    showMines = this.props.gameSettings.showMines(this.props.rowNum, this.props.colNum),
    supermanMode = this.props.gameSettings.supermanMode,
    additionalClass;

    if(showMines){ //If the player just lost
      additionalClass = 'mine';
    }
    else if(getCellInfo.isOpen) {
      var count = getCellInfo.count.toString();
      additionalClass = (count > 0) ? ('n' + getCellInfo.count.toString()) : 'open';
    }
    else if(getCellInfo.hasFlag) {
      additionalClass = 'flag'
    }
    else if(supermanMode && getCellInfo.hasMine) {
      additionalClass = 'x'
    }

    return (
      <button className={"myCell " + additionalClass} onClick={this.cellClick}></button>
    );
  }
});

module.exports = Cell;
