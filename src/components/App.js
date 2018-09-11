import React from 'react'
import MindMap from './MindMap'

import '../styles/App.css'
import '../styles/MindMap.css'

import menuIcon from "../images/menu.svg";
import closeIcon from "../images/close.svg";
import exportIcon from "../images/export.png";

class App extends React.Component {
  constructor(props) {
    super(props)

    this.toggleMenu = this.toggleMenu.bind(this)
    this.exportSvg = this.exportSvg.bind(this)
    
    this.state = {
      isActive: false,
    }
  }
  componentDidMount() {
    const mindMap = new MindMap('#MindMap')
    window.mindMap = mindMap
  }
  toggleMenu() {
    this.setState({
      isActive: !this.state.isActive
    })
  }
  exportSvg() {
    const svg = document.querySelector('svg').outerHTML
    const svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = svgUrl;
    downloadLink.download = 'mind-map';
    downloadLink.click();
  }
  render() {
    const {isActive} = this.state
    return (
      <div id="App">
        <div id="MindMap"></div>
        <div id="Sidebar" className={isActive ? 'Active' : ''}>
          <div id="Menu" onClick={this.toggleMenu}>
            {isActive ?
              <img src={closeIcon} alt="close" className="Close-Icon" /> :
              <img src={menuIcon} alt="menu" className="Menu-Icon" />
            }
          </div>
          <div id="Export" onClick={this.exportSvg}>
            <img src={exportIcon} alt="export" className="Export-Icon" />
          </div>
        </div>
      </div>
    )
  }
}

export default App
