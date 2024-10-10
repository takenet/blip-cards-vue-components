<template>
  <div class="parent">
    <div class="left">
      <Parameters :parameters="parameters" />
    </div>
    <div class="middle">
      <div class="ss-container light-theme" v-chat-scroll="{ scrollToTop: false, onScroll }" ref="commandsThread">
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
          :translations="translations"
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
          :translations="translations"
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
        position: 'left',
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
        failedToSend: 'Falha ao enviar a mensagem.',
        audioTranscription: {
          action: 'Transcrever áudio',
          loading: 'Preparando transcrição...',
          fullTranscription: 'Transcrição completa',
          title: 'Transcrição de áudio',
          readMore: 'Ler mais',
          readLess: 'Ler menos'
        },
        unsupportedContent: 'Conteúdo não suportado',
        location: 'Localização'
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

      setTimeout(() => this.scrollCommandsThread(), 200)
    },
    scrollCommandsThread() {
      const el = this.$refs.commandsThread
      el.scrollIntoView({ block: 'end', behavior: 'smooth' })
    },
    onScroll() {},
    onUnsupportedType() {}
  }
}
</script>

<style lang="scss">
@import 'styles/variables.scss';
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&display=swap');

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
  color: #2E3438;
  margin: 0;
  padding: 0;
  font-size: 14px;
  max-width: 100vw;
  background: rgb(255,255,255);
  background: linear-gradient(156deg, rgba(255,255,255,1) 0%, rgba(197,217,251,1) 23%, rgba(255,255,255,1) 64%);
}

input[type="text"] {
  box-sizing: border-box;
  padding: 8px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #c4c4c4;
  background-color: #ffffff;
}

.light-theme {
  max-width: 100%;
  padding: 10px 50px;
}

.parent {
  display: flex;
  height: 100vh;
  min-height: 100vh;

  > .left,
  > .right {
    width: 280px;
    padding: 8px;
  }

  > .left {
    overflow: auto;
  }

  > .middle {
    margin: 10px 0;
    flex-grow: 1;
    max-width: calc(100vw - 595px);
    overflow: auto;
    border: 1px solid $color-light-surface-3;
    border-radius: 8px;
    background-color: $color-surface-2;
  }
}
</style>
