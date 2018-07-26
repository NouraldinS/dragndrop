import React, { Component } from 'react';
import Workspace from './components/workspace';
import './App.css';

class App extends Component {
  state = {
    gridSize: 3,
    mounted: true,
  }

  handleGridSizeChange(gridSize) {
    console.log(gridSize);

    this.setState({
      ...this.state,
      mounted: false
    }, () => {
      this.setState({
        ...this.state,
        gridSize,
        mounted: true
      });
    });
  }

  render() {
    const { gridSize, mounted } = this.state;
    return (
      <div className="App">
        <input type="number" onChange={({ target }) => this.handleGridSizeChange(parseInt(target.value))} defaultValue={3}/>
        { mounted && <Workspace gridSize={gridSize} />}
      </div>
    );
  }
}

export default App;
