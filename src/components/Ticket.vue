

<template>
  <div class="blip-container ticket" v-if="document.status === 'Waiting' || document.status.indexOf('Closed') !== -1 ">
    <p class="subtitle fancy" v-if="document.status === 'Waiting'"><span>Chatbot {{identity}} encaminhou a conversa para atendimento</span></p>
    <p class="subtitle fancy" v-else-if="document.status === 'ClosedAttendant'"><span>Atendente {{agentIdentity}} encerrou o atendimento</span></p>
    <p class="subtitle fancy" v-else-if="document.status === 'ClosedClient'"><span>Cliente encerrou o atendimento</span></p>
    <h3>Ticket #{{`${document.sequentialId}${document.sequentialSuffix ? document.sequentialSuffix : ''}`}}</h3>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'ticket',
  mixins: [base],
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
  color: #8ca0b3;
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
    border-bottom: 1px solid #e3ecec;
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
