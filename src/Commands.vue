<template>
  <div>
    <div class="commands-content" v-if="isSample">
      <h1>Commands</h1>
      <button @click="sendCommand('clear-all')" class="clear">Clear All</button>
    </div>
    <div class="commands-content-scroll" v-if="isSample">
      <button @click="sendCommand('text')">Texto</button>
      <button @click="sendCommand('text-with-email')">Texto contendo email</button>
      <button @click="sendCommand('menu')">Menu</button>
      <button @click="sendCommand('quick-reply')">QuickReply</button>
      <button @click="sendCommand('multimedia-menu')">Menu Multimídia</button>
      <button @click="sendCommand('collection')">Coleção</button>
      <button @click="sendCommand('image')">Imagem</button>
      <button @click="sendCommand('sticker')">Sticker</button>
      <button @click="sendCommand('audio')">Audio</button>
      <button @click="sendCommand('video')">Video</button>
      <button @click="sendCommand('weblink')">WebLink</button>
      <button @click="sendCommand('document')">Documento</button>
      <button @click="sendCommand('location')">Location</button>
      <button @click="sendCommand('ask-location')">Pedido de Localização</button>
      <button @click="sendCommand('chat-state')">Chatstate</button>
      <button @click="sendCommand('ticket')">Ticket</button>
      <button @click="sendCommand('unsupported-content')">Unsupported Content</button>
      <button @click="sendCommand('survey')">Survey</button>
      <button @click="sendCommand('contact')">Contato</button>
      <button @click="sendCommand('list-menu')">Menu List</button>
      <button @click="sendCommand('multi-section-list-menu')">Menu List Multi Section</button>
      <button @click="sendCommand('reply-button')">Reply Button</button>
      <button @click="sendCommand('reply-message')">Reply Message</button>
      <button @click="sendCommand('reply-text-message-with-document')">Reply Message de Texto com Documento</button>
      <button @click="sendCommand('reply-text-message-with-video')">Reply Message de Texto com Video</button>
      <button @click="sendCommand('reply-text-message-with-audio')">Reply Message de Texto com Audio</button>
      <button @click="sendCommand('reply-text-message-with-image')">Reply Message de Texto com Imagem</button>
      <button @click="sendCommand('reply-menu-message')">Reply Message de Menu</button>
      <button @click="sendCommand('reply-list-menu-message')">Reply Message de Menu List</button>
      <button @click="sendCommand('reply-multi-section-list-menu-message')">Reply Message de Menu List Multi Section</button>
      <button @click="sendCommand('reply-message-with-button-reply')">Reply Message de Reply Buttton</button>
      <button @click="sendCommand('reply-message-with-headerless-button-reply')">Reply Message de Reply Buttton sem header</button>
      <button @click="sendCommand('text-reaction')">Reaction de texto</button>
      <button @click="sendCommand('audio-reaction')">Reaction de áudio</button>
      <button @click="sendCommand('video-reaction')">Reaction de vídeo</button>
      <button @click="sendCommand('image-reaction')">Reaction de imagem</button>
      <button @click="sendCommand('sticker-reaction')">Reaction de sticker</button>
      <button @click="sendCommand('file-reaction')">Reaction de arquivo</button>
      <button @click="sendCommand('location-reaction')">Reaction de location</button>
      <button @click="sendCommand('website-reaction')">Reaction de web link</button>
      <button @click="sendCommand('remove-reaction')">Remover reação</button>
      <button @click="sendCommand('unsupported-content-reaction')">Reação de conteúdo não suportado</button>
      <button @click="sendCommand('conversation-summary')">Resumo da conversa</button>
      <button @click="sendCommand('template-content')">Template Message</button>
      <button @click="sendCommand('template-content-button-website')">Template Message - Botão Weblink</button>
      <button @click="sendCommand('template-content-button-phonenumber')">Template Message - Botão Phone Number</button>
      <button @click="sendCommand('template-content-button-website-and-phonenumber')">Template Message - Botão Weblink e Botão telefone</button>
      <button @click="sendCommand('template-content-button-quick-reply')">Template Message - Botão QuickReply</button>
    </div>
    <div v-else>
      <h1>Custom JSON:</h1>
      <textarea v-model="json"></textarea>
      <button class="button" @click="sendCommand('custom-json')">ENVIAR JSON</button>
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
      json: ''
    }
  },
  methods: {
    sendCommand(type) {
      if (type === 'custom-json') {
        try {
          const customJsonParsed = JSON.parse(this.json)
          this.$emit('send', customJsonParsed)
        } catch (error) {
          alert('JSON inválido')
          return
        }
      }

      this.$emit('send', type === 'clear-all' ? 'clear-all' : commandExamples[type])
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
  margin-bottom: 0.5rem;
}

.commands-content-scroll {
  max-height: calc(100vh - 95px);
  overflow-y: auto;
}
</style>