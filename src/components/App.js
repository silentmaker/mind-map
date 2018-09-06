import React from 'react'
import MindMap from './MindMap'

import '../styles/MindMap.css'

class App extends React.Component {
  componentDidMount() {
    const mindMap = new MindMap('#MindMap')
    window.mindMap = mindMap
  }
  render() {
    return (
      <div className="App">
        <div id="MindMap" style={{margin: 20}}></div>
      </div>
    )
  }
}

export default App
