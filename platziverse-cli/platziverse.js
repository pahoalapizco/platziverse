'use stric'

/* eslint new-cap: "off" */

const blessed = require('blessed')
const contrib = require('blessed-contrib')

const screen = blessed.screen()
const grid = new contrib.grid({
  rows: 1,
  cols: 4,
  screen
})

const tree = grid.set(0, 0, 1, 1, contrib.tree, {
  label: 'Connected Agent'
})

const line = grid.set(0, 1, 1, 3, contrib.line, {
  label: 'Metric',
  showLegend: true,
  minY: 0,
  xPadding: 5
})

screen.key(['escape', 'q', 'C-c'], (ch, key) => {
  process.exit(0)
})

screen.render()
