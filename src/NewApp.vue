<template>
  <div class="parent">
    <div class="left">
      <Parameters :parameters="parameters" />
    </div>
    <div class="middle">
      <div class="ss-container light-theme" v-chat-scroll="{ scrollToTop: false, onScroll }">
        <blip-group-card
          v-if="parameters.group"
          :failed-to-send-msg="translations.failedToSend"
          :documents="docs"
          :photo="photoUri"
          :deletable="parameters.deletable"
          :on-selected="selected"
          :hide-options="false"
          :on-save="save"
          :on-deleted="deleted"
          :editable="parameters.editable"
          :on-open-link="selected"
          :on-unsupported-type="onUnsupportedType"
          :on-location-error="selected"
          :disable-link="parameters.disableLink"
          :readonly="parameters.readonly"
        />
        <div v-else v-for="(item, index) in docs" v-bind:key="index">
          <blip-card
            :photo="item.photo"
            :position="item.position"
            :deletable="parameters.deletable"
            :date="item.date"
            :on-selected="selected"
            :hide-options="false"
            :document="item.document"
            :status="item.status"
            :on-save="save"
            :on-deleted="deleted"
            :editable="parameters.editable"
            :on-open-link="selected"
            :on-unsupported-type="onUnsupportedType"
            :on-location-error="selected"
            :disable-link="parameters.disableLink"
            :readonly="parameters.readonly"
          />
        </div>
      </div>
    </div>
    <div class="right">
      <Commands @send="sendCommand" :is-sample="parameters.isSample" />
    </div>
  </div>
</template>

<script>
import Parameters from './Parameters.vue'
import Commands from './Commands.vue'

export default {
  name: 'newApp',
  components: {
    Parameters,
    Commands
  },
  data() {
    return {
      parameters: {
        position: 'right',
        isSample: true,
        date: '08:32 PM',
        photo: false,
        group: false,
        msgStatus: 'accepted',
        disableLink: false,
        editable: true,
        deletable: true,
        readonly: false
      },
      documents: [],
      translations: {
        failedToSend: 'Falha ao enviar a mensagem.'
      },
      selected: () => {},
      save: () => {},
      deleted: () => {}
    }
  },
  computed: {
    docs() {
      return this.documents.map((document) => ({ ...document, photo: this.parameters.photo ? this.photoUri : '' }))
    },
    photoUri() {
      return this.parameters.photo ? 'http://placehold.it/25x25' : false
    }
  },
  mounted() {
    this.sendCommand({
      id: '1',
      to: '128271320123982@messenger.gw.msging.net',
      type: 'text/plain',
      content: 'Seja bem-vindo ao nosso serviço! Como podemos te ajudar?'
    })
  },
  methods: {
    sendCommand(command) {
      if (command === 'clear-all') {
        this.documents = []
        return
      }

      this.documents.push({
        document: command,
        date: this.parameters.date,
        position: this.parameters.position,
        status: this.parameters.msgStatus
      })
    },
    onScroll() {},
    onUnsupportedType() {}
  }
}
</script>

<style lang="scss">
@import 'styles/variables.scss';
* {
  &::-webkit-scrollbar {
    width: 16px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border: 4px solid transparent;
    border-radius: 10px;
    background-clip: content-box;
    background-color: #b9cbd3;
  }
}

body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  max-width: 100vw;
}

.light-theme {
  max-width: 100%;
  padding: 10px 50px;
}

.parent {
  display: flex;
  height: 100vh;
  min-height: 100vh;
  border-right: 1px solid #CFCFCF;
  border-left: 1px solid #CFCFCF;

  > .left,
  > .right {
    width: 280px;
    padding: 8px;
    background-color: #E0E0E0;
  }

  > .right {
    border-left: 1px solid #A3A3A3;
  }

  > .left {
    border-right: 1px solid #A3A3A3;
    overflow: auto;
  }

  > .middle {
    flex-grow: 1;
    max-width: calc(100vw - 560px);
    overflow: auto;
    background-color: $color-surface-2;
  }
}
</style>
