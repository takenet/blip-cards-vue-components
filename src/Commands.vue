<template>
  <div>
    <div class="commands-content" v-if="isSample">
      <h1>Commands</h1>
      <button @click="clearAll" class="clear">Clear all sent commands</button>
      <input type="text" class="input-search" placeholder="Find your command" v-on:keyup="search" v-model="searchCriteria" />
    </div>
    <div class="commands-content-scroll" v-if="isSample">
      <button
        v-for="(commandKey, index) in Object.keys(commands)"
        :key="index"
        @click="() => sendCommand(commands[commandKey].command)"
      >
        {{ commands[commandKey].buttonLabel }}
      </button>
      <bds-grid v-if="commands.length === 0" xss="12" xs="12" sm="12" md="12" lg="12" align-items="center" justify-content="center" padding="3">
        <h2>No commands found</h2>
      </bds-grid>
    </div>
    <div v-else>
      <h1>Custom JSON:</h1>
      <textarea v-model="json"></textarea>
      <button class="button" @click="sendCustomJson">ENVIAR JSON</button>
    </div>
  </div>
</template>

<script>
import { commandExamples } from './commandExamples'

export default {
  name: 'commands',
  props: {
    isSample: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      json: '',
      searchCriteria: '',
      commands: commandExamples
    }
  },
  methods: {
    sendCommand(command) {
      this.$emit('send', command)
    },
    sendCustomJson() {
      try {
        const customJsonParsed = JSON.parse(this.json)
        this.$emit('send', customJsonParsed)
      } catch (error) {
        alert('JSON inválido')
      }
    },
    clearAll() {
      this.$emit('send', 'clear-all')
    },
    search() {
      const searchCriteria = this.searchCriteria.toLowerCase()
      const localCommands = commandExamples

      if (searchCriteria === '') {
        this.commands = localCommands
        return
      }

      const filteredCommands = localCommands.filter(command => {
        const commandLabel = command.buttonLabel.toLowerCase()

        return commandLabel.includes(searchCriteria)
      })

      this.commands = filteredCommands
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
}

button {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #c4c4c4;
  background-color: #fff;
}

button:hover {
  background-color: #C5D9FB;
  cursor: pointer;
}

button.clear {
  background-color: #FBC5C5;
}

textarea {
  box-sizing: border-box;
  width: 100%;
  height: 500px;
  border-radius: 5px;
  border: 1px solid #c4c4c4;
}

.commands-content,
.commands-content-scroll {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.commands-content {
  margin-bottom: 1rem;
}

.commands-content-scroll {
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}
.input-search {
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfmBgYLAxiS9tw3AAAAkUlEQVQ4y2NgGAWDATBiiGgypDOoMrxkWMOwDZsGZjS+EsNUhisMyxg+MqQwfGO4TtjGKoYOKCuIYT02BUxofBmGy1DWZQYBBj7CGh4yGEJZxgwfGD4T9sNDhhQGdQZWBleGaIYLDHsJa/jEcJTBhMGNgZ9hK4MbAz/DaVKC3IhhB0MWabFkxLCYgWM0sdIBAACXYRlR33ujEQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wNi0wNlQxMTowMzoyNCswMDowMPFFbRsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDYtMDZUMTE6MDM6MjQrMDA6MDCAGNWnAAAAAElFTkSuQmCC') #ffffff no-repeat scroll 0px -1px;
  background-size: 35px 35px;
  padding-left: 30px;
}
</style>