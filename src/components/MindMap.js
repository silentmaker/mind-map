import React from 'react'
import * as D3 from 'd3'

import '../styles/MindMap.css'

class MindMap extends React.Component {
  componentDidMount() {
    const {padding, nodes, links} = this.props
    const container = D3.select("#MindMap")
    const width = container.property('clientWidth') - padding * 2
    const height = container.property('clientHeight') - padding * 2

    container.append("svg:svg").attr("width", width).attr("height", height);

    const simulation = D3.forceSimulation()
      .force("link", D3.forceLink().id(data => data.id))
      .force('charge', D3.forceManyBody())
      .force('center', D3.forceCenter(width/2, height/2))

    const svg = container.select('svg')

    const dragStart = (data) => {
      if (!D3.event.active) simulation.alphaTarget(0.3).restart();
      data.fx = data.x;
      data.fy = data.y;
    }
    
    const dragging = (data) => {
      data.fx = D3.event.x;
      data.fy = D3.event.y;
    }
    
    const dragEnd = (data) => {
      if (!D3.event.active) simulation.alphaTarget(0);
      data.fx = null;
      data.fy = null;
    }

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")

    const node = svg.append('g')
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 5)
      .call(
        D3.drag()
          .on('start', dragStart)
          .on('drag', dragging)
          .on('end', dragEnd)
      )

    const ticked = () => {
      link.attr('x1', data => data.source.x)
        .attr('y1', data => data.source.y)
        .attr('x2', data => data.target.x)
        .attr('y2', data => data.target.y)

      node.attr('cx', data => data.x)
        .attr('cy', data => data.y)
    }

    simulation.nodes(nodes).on('tick', ticked)
    simulation.force('link').links(links)
  }
  render() {
    const {padding} = this.props

    return (
      <div id="MindMap" style={{padding}}></div>
    )
  }
}

export default MindMap
