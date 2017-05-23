var React = require('react');
var Cell = require('Cell');

var Row = React.createClass({
  render: function () {
    var cells = [],
    rowNum = this.props.rowNum,
    boardWidth = this.props.gameSettings.boardWidth;
    for (var i = 0; i < boardWidth; i++) {
      cells[i] = <Cell key={i} rowNum={rowNum} colNum={i} gameSettings={this.props.gameSettings}/>;
    }
    return (
      <tr>{cells}</tr>
    );
  }
});

module.exports = Row;
