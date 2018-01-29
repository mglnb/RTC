import { log } from '../helper'
class DataChannel {
  static bindChannelEvents(channel) {
    channel.onmessage = event => {
      let data = JSON.parse(event.data)
      log(data, 'log', 'purple')
    }

    channel.onopen = () => {
      channel.push = channel.send
      channel.send = data => channel.push(JSON.stringify(data))
    }

    channel.onerror = (error) => {
      log(JSON.stringify(error, null, '\t'), 'error')
    }
    channel.onclose = (event) => {
      log(JSON.stringify(event, null, '\t'), 'warn')
    }
  }
}

export default DataChannel
