<template>
  <div class="flex" :class="'notification ' + position" v-if="date">
    <img
      v-if="this.status !== 'failed' && this.position === 'right'"
      :src="this.getImage"
    />
    <div
      v-else-if="this.status === 'failed' && this.position === 'right'"
      class="failure"
    >
      {{ failedToSendMsg }}
    </div>
    {{ date }}
  </div>
</template>

<script>
import checkSentSvg from '../assets/img/CheckSent.svg'
import clockSvg from '../assets/img/clock.svg'
import doubleCheckReceivedSvg from '../assets/img/DoubleCheckReceived.svg'
import doubleCheckReadSvg from '../assets/img/DoubleCheckRead.svg'

export default {
  name: 'blip-card-date',
  props: {
    status: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'left'
    },
    date: {
      type: String
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem.'
    }
  },
  computed: {
    getImage() {
      switch (this.status) {
        case 'waiting':
          return clockSvg
        case 'accepted':
          return checkSentSvg
        case 'received':
          return doubleCheckReceivedSvg
        case 'consumed':
          return doubleCheckReadSvg
        case 'failed':
        default:
          break
      }
    }
  }
}
</script>
