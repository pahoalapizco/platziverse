<template>
  <div>
<!--     <metric 
      uuid="c75b6205-1b14-4947-a015-b600ff0566d8" 
      type="PromiseMetric"
      :socket="socket">
    </metric> -->
    <agent
      uuid="06758aa1-7a22-4c71-9079-ffd7e8c4c134"
      :socket="socket"
    ></agent>
    <agent
      v-for="agent in agents"
      :uuid="agent.uuid"
      :key="agent.uuid">
    </agent>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<style>
  body {
    font-family: Arial;
    background: #f8f8f8;
    margin: 0;
  }
</style>

<script>
const io = require('socket.io-client')
const socket = io()

module.exports = {
  data () {
    return {
      agents: [],
      error: null,
      socket
    }
  },

  mounted () {
    this.initialize()
  },

  methods: {
    initialize () {
    }
  }
}
</script>
