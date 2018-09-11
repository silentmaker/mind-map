import React from 'react'
import MindMap from './MindMap'
import Palettes from './Palettes'

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
    this.setPalette = this.setPalette.bind(this)
    this.colors = Object.keys(Palettes)
    
    this.state = {
      palette: this.colors[0],
      isActive: false,
      mindMap: null,
    }
  }
  componentDidMount() {
    this.setState({
      mindMap: new MindMap('#MindMap')
    })
  }
  setPalette(color) {
    this.setState({
      palette: color
    }, () => {
      console.log(Palettes[color])
      this.state.mindMap.setPalette(Palettes[color])
    })
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
    const {isActive, palette} = this.state
    const {colors, toggleMenu, exportSvg, setPalette} = this

    return (
      <div id="App">
        <div id="MindMap"></div>
        <div id="Sidebar" className={isActive ? 'Active' : ''}>
          <div className="Label">Palette</div>
          <ul id="Palette">
            {colors.map(color => 
              <li key={color} className={palette === color ? 'Current' : ''} 
                style={{backgroundColor: Palettes[color][0]}}
                onClick={() => setPalette(color)}>
              </li>
            )}
          </ul>
          <div id="Menu" onClick={toggleMenu}>
            {isActive ?
              <img src={closeIcon} alt="close" className="Close-Icon" /> :
              <img src={menuIcon} alt="menu" className="Menu-Icon" />
            }
          </div>
          <div id="Export" onClick={exportSvg}>
            <img src={exportIcon} alt="export" className="Export-Icon" />
          </div>
        </div>
      </div>
    )
  }
}

export default App
