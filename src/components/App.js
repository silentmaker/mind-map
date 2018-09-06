import React from 'react'
import ItemEditor from './ItemEditor'
import MindMap from './MindMap'

const data = {
  nodes: [
    {id: 1, content: 'Colors'},
    {id: 2, content: 'Red'},
    {id: 3, content: 'Blue'},
    {id: 4, content: 'White'}
  ],
  links: [
    {source: 1, target: 2},
    {source: 1, target: 3},
    {source: 1, target: 4},
  ]
}

const App = () => (
  <div className="App">
    <ItemEditor />
    <MindMap
      padding={20}
      nodes={data.nodes}
      links={data.links}
    />
  </div>
)

export default App
