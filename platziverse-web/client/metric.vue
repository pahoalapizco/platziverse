<template>
  <div class="metric">
    <h3 class="metric-type">{{ type }}</h3>
    <line-chart
      :chart-data="datacollection"
      :options="{ responsive: true }"
      :width="400" :height="200"
    ></line-chart>
    <p v-if="error">{{error}}</p>
  </div>
</template>
<style>
  .metric {
    border: 1px solid white;
    margin: 0 auto;
  }
  .metric-type {
    font-size: 28px;
    font-weight: normal;
    font-family: 'Roboto', sans-serif;
  }
  canvas {
    margin: 0 auto;
  }
</style>
<script>
const request = require('request-promise-native')
const LineChart = require('./line-chart')
const moment = require('moment')
const randomColor = require('random-material-color')
const { serverHost } = require('../config')

module.exports = {
  name: 'metric',
  components: {
    LineChart
  },
  props: [ 'uuid', 'type', 'socket' ],

  data() {
    return {
      datacollection: {},
      error: null,
      color: null
    }
  },

  mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      const { uuid, type } = this // los toma de props

      this.color = randomColor.getColor()

      const options = {
        method: 'GET',
        url: `${serverHost}/metrics/${uuid}/${type}`,
        json: true
      }
      let result
      try {
        result = await request(options)
      } catch (e) {
        this.error = e.error.error //error.errorPromise.errorAPI
        return
      }

      const labels = []
      const data = []

      // Valida que el resultado sea un arreglo de metricas
      if (Array.isArray(result)) {
        result.forEach(m => {
          labels.push(moment(m.createdAt).format('HH:mm:ss'))
          data.push(m.value)
        })
      }

      this.datacollection = {
        labels,
        datasets: [{
          backgroundColor: this.color,
          label: type,
          data
        }]
      }
      this.startRealtime()
    },

    startRealtime () {
      const { uuid, type, socket } = this // los toma de props
      
      socket.on('agent/message', payload => {
        const metric = payload.metrics.find(m => m.type === type)

        // Copiamos los valores actuales.
        const labels = this.datacollection.labels
        const data = this.datacollection.datasets[0].data

        // Elimina el primer elemento si length > 20
        const length = labels.length || data.length

        if (length >= 20) {
          labels.shift()
          data.shift()
        }
        
        // Agrega nuevos elementos
        labels.push(moment(metric.createdAt).format('HH:mm:ss'))
        data.push(metric.value)

        this.datacollection = {
          labels,
          datasets: [{
            backgroundColor: this.color,
            label: type,
            data
          }]
        }

      })
    },

    handleError (err) {
      this.error = err.message
    }
  }
}
</script>
