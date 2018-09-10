import React from 'react'
import MindMap from './MindMap'

import '../styles/App.css'
import '../styles/MindMap.css'

class App extends React.Component {
  componentDidMount() {
    const mindMap = new MindMap('#MindMap')
    window.mindMap = mindMap
  }
  export() {
    const svg = document.querySelector('svg').outerHTML
    const svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = svgUrl;
    downloadLink.download = 'mind-map';
    downloadLink.click();
  }
  render() {
    return (
      <div className="App">
        <div className="Button" onClick={() => this.export()}>EXPORT</div>
        <div id="MindMap"></div>
      </div>
    )
  }
}

export default App
