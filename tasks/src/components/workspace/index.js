import React, { Component } from 'react';
import './index.css';

class Workspace extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      dragging: false,
      mousePosition: [],
      activeElement: null,
    }
    this.inDrag = this.inDrag.bind(this);
    this.switch = this.switch.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.startDrag = this.startDrag.bind(this);
  }


  startDrag(e) {
    const { grid } = this.state;
    const { gridSize } = this.props;
    const { clientX, clientY } = e;
    const gridhtml = document.getElementById('grid');
    const gridBounds = gridhtml.getBoundingClientRect();
    const gridCellCol = parseInt(clientX / (gridBounds.width / gridSize));
    const gridCellRow = parseInt(clientY / (gridBounds.height / gridSize));
    this.setState({
      ...this.state,
      dragging: true,
      activeElement: [gridCellRow, gridCellCol],
    });
  }

  inDrag(e) {
    const { dragging } = this.state;
    const { gridSize } = this.props;
    if (dragging) {
      const { clientX, clientY } = e;
      const grid = document.getElementById('grid');
      const gridBounds = grid.getBoundingClientRect();
      const gridCellCol = parseInt(clientX / (gridBounds.width / gridSize));
      const gridCellRow = parseInt(clientY / (gridBounds.height / gridSize));
      this.setState({
        ...this.state,
        gridCellCol,
        gridCellRow,
        mousePosition: [clientX, clientY]
      });
    }
  }

  endDrag(e) {
    const { mousePosition } = this.state;
    const { gridSize } = this.props;

    const { clientX, clientY } = e;
    const grid = document.getElementById('grid');
    const gridBounds = grid.getBoundingClientRect();
    const gridCellCol = parseInt(clientX / (gridBounds.width / gridSize));
    const gridCellRow = parseInt(clientY / (gridBounds.height / gridSize));
    console.log('gridCellCol', gridCellCol);
    console.log('gridCellRow', gridCellRow);
    this.switch(
      gridCellCol >= gridSize ? gridSize -1 : gridCellCol,
      gridCellRow >= gridSize ? gridSize -1 : gridCellRow,
      () => {
        this.setState({
          ...this.state,
          dragging: false,
          activeElement: null,
          gridCellCol: undefined,
          gridCellRow: undefined,
          mousePosition: []
        });
      });
  }

  createGrid(gridSize) {
    const grid = [];
    let counter = 0;
    for (let a = 0; a < gridSize; a++) {
      grid.push([]);
      for (let b = 0; b < gridSize; b++) {
        grid[a][b] = counter++;
      }
      grid[a] = shuffle(grid[a]);
    }
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
    return shuffle(grid);
  }

  switch(col, row, cb) {
    let count = 0;
    let success = true;
    const { grid } = this.state;
    const { gridSize } = this.props;
    for (let a = 0; a < gridSize; a++) {
      for (let b = 0; b < gridSize; b++) {
        if (grid[a][b] !== count++) {
          success = false;
          break;
        }
      }
    }
    if (success) this.setState({success: true});
    const [ ac1, ac2 ] = this.state.activeElement;
    const selected = grid[ac1][ac2];
    const placement = grid[row][col];
    const gridCopy = JSON.parse(JSON.stringify(grid))
      .map(row => row.map(col => col === selected ? placement : col === placement ? selected : col))
    this.setState({
      ...this.state,
      grid: gridCopy
    }, cb);
  }

  componentDidMount() {
    const { gridSize } = this.props;
    this.setState({
      ...this.state,
      grid: this.createGrid(gridSize)
    });
  }

  render() {
    const { gridSize } = this.props;
    const {
      grid,
      dragging,
      gridCellCol,
      gridCellRow,
      activeElement,
      mousePosition,
      success
    } = this.state;
    if (success) return <h1>SUCESS!!!!</h1>
    return (
      <div>
        <div id="grid" className={'grid'} style={{gridTemplateColumns: `repeat(${gridSize}, 1fr)`}}>
        {
          grid.map((row, a) => row.map((col, b) => (
            <div
            onMouseDown={this.startDrag}
            onMouseMove={this.inDrag}
            onMouseUp={this.endDrag}
            style={{
              backgroundColor: a === gridCellRow && b === gridCellCol ? 'green' : 'unset'
            }}
            >
            {col}
            </div>
          )))
        }
        </div>
        {
          dragging && (activeElement || activeElement == 0) &&
          <div
          className={'shadow'}
          style={{
            left: mousePosition[0],
            top: mousePosition[1],
            userselect: 'none',
            width: 60,
            height: 50,
            backgroundColor: '#cbcbcb',
            pointerEvents: 'none',
            position: 'absolute'
          }}
          >
          {grid[activeElement[0]][activeElement[1]]}
          </div>
        }
      </div>
    )
  }
}

export default Workspace;
