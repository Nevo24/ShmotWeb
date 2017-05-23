var React = require('react'),
Row = require('Row');

var Board = React.createClass({
  render: function () {
    var rows = [],
    boardHeight = this.props.gameSettings.boardHeight;
    for (var i = 0; i < boardHeight; i++) {
      rows[i] = <Row key={i} rowNum={i} gameSettings={this.props.gameSettings}/>;
    }
    return (
      <table>{rows}</table>
    );
  }
});

module.exports = Board;
