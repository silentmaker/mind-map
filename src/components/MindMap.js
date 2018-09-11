import * as D3 from 'd3'
import Palettes from './Palettes'

import plusImage from '../images/plus.svg'
import editImage from '../images/edit.svg'
import deleteImage from '../images/delete.svg'

class MindMap {
  constructor(selector, data) {
    const container = D3.select(selector)

    this.width = container.property('clientWidth')
    this.height = container.property('clientHeight')
    this.uid = (type) => `${type || 'uid'}-${new Date().getTime()}`
    container.append("svg:svg")
      .attr('id', this.uid('svg'))
      .attr("width", this.width)
      .attr("height", this.height);
    this.data = data || JSON.parse(localStorage.getItem('mindMapData')) || ({
      nodes: [{id: this.uid('node'), content: 'root', level: 0}],
      links: []
    })
    this.svg = container.select('svg')
    this.simulation = D3.forceSimulation()
      .force("link", D3.forceLink().distance(140).id(data => data.id))
      .force('charge', D3.forceManyBody().strength(-120))
      .force('center', D3.forceCenter(this.width/2 - 50, this.height/2 - 20))
      .force('collide', D3.forceCollide().radius(60))
    this.linesGroup = this.svg.append("g").attr("id", "links")
    this.nodesGroup = this.svg.append('g').attr("id", "nodes")
    this.palette = Palettes.Blue
    this.update()
  }
  dragStart(data, simulation) {
    if (!D3.event.active) simulation.alphaTarget(0.3).restart();
    data.fx = data.x;
    data.fy = data.y;
  }
  dragging(data) {
    data.fx = D3.event.x;
    data.fy = D3.event.y;
  }
  dragEnd(data, simulation) {
    if (!D3.event.active) simulation.alphaTarget(0);
    data.fx = null;
    data.fy = null;
  }
  setPalette(palette) {
    this.palette = palette
    this.update()
  }
  add(data) {
    const content = window.prompt('Add Node')

    if (content && content.trim()) {
      const id = this.uid('node')
      this.data.nodes.push({id, content: content.trim(), level: data.level + 1})
      this.data.links.push({source: data.id, target: id})
      this.update()
      this.save()
    }
  }
  edit(node) {
    const content = window.prompt('Edit Node', node.content)

    if (content && content.trim()) {
      node.content = content
      this.save()
    }
  }
  remove(data, index) {
    if (data.level > 0) {
      const linkTarget = this.data.links.findIndex(link => link.target === data)
      const newSource = this.data.links[linkTarget].source

      this.data.nodes.splice(index, 1)
      this.data.links = this.data.links.map(link => {
        if (link.source === data) link.source = newSource
        return link
      })
      this.data.links.splice(linkTarget, 1)
      this.update()
    } else {
      alert('Cannot Remove Root Node')
    }
  }
  update() {
    const {nodes, links} = this.data
    let linesData = this.linesGroup
      .selectAll('line')
      .data(links)
    let nodesData = this.nodesGroup
      .selectAll('g')
      .data(nodes)
    const linesDataEnter = linesData.enter().append('line')
    const nodesDataEnter = nodesData.enter().append('g')
      .attr('class', 'node')
      .call(
        D3.drag()
          .on('start', data => this.dragStart(data, this.simulation))
          .on('drag', data => this.dragging(data))
          .on('end', data => this.dragEnd(data, this.simulation))
      )
    // Plus Icon
    nodesDataEnter.append('image')
      .attr('class', 'plus')
      .attr('xlink:href', plusImage)
      .attr('x', 96)
      .attr('y', 8)
      .attr('width', 26)
      .attr('height', 26)
      .on('click', (data) => {
        D3.event.stopPropagation()
        this.add(data)
      })
    // Edit Icon
    nodesDataEnter.append('image')
      .attr('class', 'edit')
      .attr('xlink:href', editImage)
      .attr('x', 96)
      .attr('y', 8)
      .attr('width', 26)
      .attr('height', 26)
      .on('click', (data) => {
        D3.event.stopPropagation()
        this.edit(data)
      })
    // Delete Icon
    nodesDataEnter.append('image')
      .attr('class', 'delete')
      .attr('xlink:href', deleteImage)
      .attr('x', 96)
      .attr('y', 8)
      .attr('width', 26)
      .attr('height', 26)
      .on('click', (data, index) => {
        D3.event.stopPropagation()
        this.remove(data, index)
      })
    // Node Rect
    nodesDataEnter.append('rect')
      .attr('width', 120)
      .attr('height', 40)
      .attr('rx', 4)
      .attr('ry', 4)
    // Node Text
    nodesDataEnter.append('text')
      .attr('x', 10)
      .attr('y', 26)
    // Node Title
    nodesDataEnter.append('title')

    linesData.exit().remove()
    nodesData.exit().remove()
    linesData = linesDataEnter.merge(linesData)
    nodesData = nodesDataEnter.merge(nodesData)
    // Update Data
    nodesData.select('rect')
    nodesData.select('image')
    nodesData.select('text')
    nodesData.select('title')
    linesData.select('line')

    const ticked = () => {
      linesData.attr('x1', data => Math.round(data.source.x + 60))
        .attr('y1', data => Math.round(data.source.y + 20))
        .attr('x2', data => Math.round(data.target.x + 60))
        .attr('y2', data => Math.round(data.target.y + 20))
      nodesData.attr('transform', data => `translate(${Math.round(data.x)}, ${Math.round(data.y)})`)
      nodesData.selectAll('rect').attr('fill', d => 6 - d.level < 0 ? this.palette[0] : this.palette[6 - d.level])
      nodesData.selectAll('title').text(data => data.content)
      nodesData.selectAll('text').each(function(data) {
        const el = D3.select(this)
        if (el.node().getComputedTextLength() < 80) {
          el.text(data.content.substring(0, el.text().length + 1))
        } else {
          el.text(data.content.substring(0, el.text().length - 1) + '\u2026')
        }
      })
    }

    this.simulation.nodes(nodes).on('tick', ticked)
    this.simulation.force('link').links(links)
    this.simulation.nodes(nodes)
    this.simulation.restart()
    this.simulation.alpha(1)
  }
  save() {
    const data = {
      nodes: this.data.nodes,
      links: this.data.links.map(item => ({source: item.source.id, target: item.target.id}))
    }
    localStorage.setItem('mindMapData', JSON.stringify(data))
  }
}

export default MindMap
