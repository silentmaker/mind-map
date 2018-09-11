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
    this.exportPNG = this.exportPNG.bind(this)
    this.setPalette = this.setPalette.bind(this)
    this.colors = Object.keys(Palettes)
    this.mindMap = null
    
    this.state = {
      palette: this.colors[0],
      isActive: false,
    }
  }
  componentDidMount() {
    this.mindMap = new MindMap('#MindMap')
  }
  setPalette(color) {
    this.setState({
      palette: color
    }, () => this.mindMap.setPalette(Palettes[color]))
  }
  exportPNG() {
    this.mindMap.export()
  }
  toggleMenu(e) {
    e.stopPropagation()
    this.setState({
      isActive: !this.state.isActive
    })
  }
  render() {
    const {isActive, palette} = this.state
    const {colors, toggleMenu, setPalette, exportPNG} = this

    return (
      <div id="App">
        <div id="MindMap"></div>
        <div id="Mask" className={isActive ? 'Active' : ''} 
          onClick={e => toggleMenu(e)}>
        </div>
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
          <div id="Menu" onClick={e => toggleMenu(e)}>
            {isActive ?
              <img src={closeIcon} alt="close" className="Close-Icon" /> :
              <img src={menuIcon} alt="menu" className="Menu-Icon" />
            }
          </div>
          <div id="Export" onClick={exportPNG}>
            <img src={exportIcon} alt="export" className="Export-Icon" />
          </div>
        </div>
      </div>
    )
  }
}

export default App
