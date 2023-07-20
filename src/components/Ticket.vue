

<template>
  <div class="blip-container ticket" v-if="document.status === 'Waiting' || document.status.indexOf('Closed') !== -1 ">
    <p class="subtitle fancy" v-if="document.status === 'Waiting'"><span>{{ waitingMsg.replace(/\{chatbotIdentity\}/g, identity) }}</span></p>
    <p class="subtitle fancy" v-else-if="document.status === 'ClosedAttendant'"><span>{{ closedAttendantMsg.replace(/\{agentIdentity\}/g, identity) }}</span></p>
    <p class="subtitle fancy" v-else-if="document.status === 'ClosedClient'"><span>{{ closedClientMsg }}</span></p>
    <h3>Ticket #{{`${document.sequentialId}${document.sequentialSuffix ? document.sequentialSuffix : ''}`}}</h3>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'ticket',
  mixins: [base],
  props: {
    waitingMsg: {
      type: String,
      default: 'Chatbot {chatbotIdentity} encaminhou a conversa para atendimento'
    },
    closedAttendantMsg: {
      type: String,
      default: 'Atendente {agentIdentity} encerrou o atendimento'
    },
    closedClientMsg: {
      type: String,
      default: 'Cliente encerrou o atendimento'
    }
  },
  computed: {
    identity() {
      return this.document.ownerIdentity.split('@')[0]
    },
    agentIdentity() {
      return this.document.agentIdentity
        ? decodeURIComponent(this.document.agentIdentity.split('@')[0])
        : ''
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../styles/variables.scss';

.ticket {
  color: $color-content-disable;
  text-align: center;
  overflow: hidden;
  padding-top: 5px;

  .subtitle {
    margin: 0;
  }
  .fancy {
    line-height: 1;
    text-align: center;
  }
  .fancy span {
    display: inline-block;
    position: relative;
  }
  .fancy span:before,
  .fancy span:after {
    content: '';
    position: absolute;
    height: 5px;
    border-bottom: 1px solid $color-surface-3;
    top: 0;
    width: 600px;
  }
  .fancy span:before {
    right: 100%;
    margin-right: 15px;
  }
  .fancy span:after {
    left: 100%;
    margin-left: 15px;
  }
}

h3 {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 10px;
}
</style>
