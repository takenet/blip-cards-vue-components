<template>
  <div>
    <div class="float" style="width: 200px">
      <div>
        <h1>Width:</h1>
        <input v-model="width" />
      </div>

      <div>
        <h1>Editing:</h1>
        <input type="checkbox" :value="true" v-model="editable" /> Editable
        <br />
        <input type="checkbox" :value="true" v-model="deletable" /> Deletable
        <br />
        <input type="checkbox" :value="false" v-model="readonly" /> Readonly
        <br />
        <label style="font-size:smaller;color:#cbb">
          Readonly property does not apply to all components. Please, checkout
          the README.md file for more information!</label
        >
      </div>

      <div>
        <h1>Position:</h1>
        <input type="radio" value="left" v-model="position" /> LEFT <br />
        <input type="radio" value="middle" v-model="position" /> MIDDLE <br />
        <input type="radio" value="right" v-model="position" /> RIGHT <br />
      </div>

      <div>
        <h1>Date:</h1>
        <input v-model="date" />
      </div>

      <div style="clear: both"></div>

      <br />

      <input type="radio" value="true" v-model="isSample" /> Samples
      <input type="radio" value="false" v-model="isSample" /> JSON
      <br />
      <input type="checkbox" value="false" v-model="photo" /> Show Photo
      <br />
      <input type="checkbox" value="false" v-model="group" /> Group Messages
      <br />
      <input type="checkbox" value="false" v-model="isExternalMessage" />
      External Message

      <div>
        <h1>Member Data:</h1>
        <input type="checkbox" value="false" v-model="hasMemberData" /> Has
        Member Data <input v-model="memberName" /> Name
        <input v-model="memberPhone" /> Phone
      </div>

      <div>
        <h1>Status notification:</h1>
        <form>
          <input
            type="radio"
            name="status"
            v-model="msgStatus"
            value="dispatched"
            checked
          />
          Dispatched <br />
          <input
            type="radio"
            name="status"
            v-model="msgStatus"
            value="accepted"
            checked
          />
          Accepted <br />
          <input
            type="radio"
            name="status"
            v-model="msgStatus"
            value="received"
          />
          Received <br />
          <input
            type="radio"
            name="status"
            v-model="msgStatus"
            value="consumed"
          />
          Consumed <br />
          <input
            type="radio"
            name="status"
            v-model="msgStatus"
            value="failed"
          />
          Failed <br />
        </form>
      </div>

      <div>
        <h1>Link rendering:</h1>
        <input type="radio" :value="false" v-model="disableLink" /> Yes <br />
        <input type="radio" :value="true" v-model="disableLink" /> No <br />
      </div>

      <div v-if="isSample === 'true'">
        <h1>Examples:</h1>
        <button class="button" @click="sendReplyMessage1">Alfredo Teste</button>
        <button class="button" @click="sendText">ENVIAR Texto</button>
        <button class="button" @click="sendTextEmail">
          ENVIAR Texto contendo email
        </button>
        <button class="button" @click="sendMenu">ENVIAR Menu</button>
        <button class="button" @click="sendQuickReply">
          ENVIAR QuickReply
        </button>
        <button class="button" @click="sendMultimediaMenu">
          ENVIAR Menu Multimídia
        </button>
        <button class="button" @click="sendCollection">ENVIAR Coleção</button>
        <button class="button" @click="sendImage">ENVIAR Imagem</button>
        <button class="button" @click="sendSticker">ENVIAR Sticker</button>
        <button class="button" @click="sendAudio">ENVIAR Audio</button>
        <button class="button" @click="sendVoice">ENVIAR Voice</button>
        <button class="button" @click="sendVideo">ENVIAR Video</button>
        <button class="button" @click="sendWebLink">ENVIAR WebLink</button>
        <button class="button" @click="sendFile">ENVIAR Documento</button>
        <button class="button" @click="sendLocation">ENVIAR Location</button>
        <button class="button" @click="sendRequestLocation">
          ENVIAR Pedido de Localização
        </button>
        <button class="button" @click="sendChatState">ENVIAR Chatstate</button>
        <button class="button" @click="sendTicket">ENVIAR Ticket</button>
        <button class="button" @click="sendCallsVoiceEnd">
          ENVIAR Fim de chamada áudio
        </button>
        <button class="button" @click="sendCallsVideoEnd">
          ENVIAR Fim de chamada vídeo
        </button>
        <button class="button" @click="sendNoAnswerCallsVoiceEnd">
          ENVIAR Fim de chamada áudio não respondida
        </button>
        <button class="button" @click="sendNoAnswerCallsVideoEnd">
          ENVIAR Fim de chamada vídeo não respondida
        </button>
        <button class="button" @click="sendCallsVoiceRequest">
          ENVIAR Solicitação de chamada
        </button>
        <button class="button" @click="sendRaw">
          ENVIAR Unsupported Content
        </button>
        <button class="button" @click="sendApplicationJsonUnsupportedContent">
          ENVIAR ApplicationJson Unsupported Content
        </button>
        <button class="button" @click="sendSurveyContent">ENVIAR Survey</button>
        <button class="button" @click="toogleBlipGroupCard">
          CRIAR/DESTRUIR scroll
        </button>
        <button class="button" @click="sendContact">
          ENVIAR Contato
        </button>
        <button class="button" @click="sendCallToAction">
          ENVIAR Conteúdo dinâmico (CTA)
        </button>
        <button class="button" @click="sendJsonText">
          ENVIAR Text Flow
        </button>
        <button class="button" @click="sendMenuList">
          ENVIAR Menu List
        </button>
        <button class="button" @click="sendMenuListMultiSection">
          ENVIAR Menu List Multi Section
        </button>
        <button class="button" @click="sendReplyButton">
          ENVIAR Reply Button
        </button>
        <button class="button" @click="sendReplyMessage">
          ENVIAR Reply Message
        </button>
        <button class="button" @click="sendReplyTextMessageWithDocument">
          ENVIAR Reply Message de Texto com Documento
        </button>
        <button class="button" @click="sendReplyTextMessageWithVideo">
          ENVIAR Reply Message de Texto com Video
        </button>
        <button class="button" @click="sendReplyTextMessageWithAudio">
          ENVIAR Reply Message de Texto com Audio
        </button>
        <button class="button" @click="sendReplyTextMessageWithImage">
          ENVIAR Reply Message de Texto com Imagem
        </button>
        <button class="button" @click="sendReplyMessageInReplyToMenu">
          ENVIAR Reply Message de Menu
        </button>
        <button class="button" @click="sendReplyMessageInReplyToMenuList">
          ENVIAR Reply Message de Menu List
        </button>
        <button
          class="button"
          @click="sendReplyMessageInReplyToMenuListMultiSection"
        >
          ENVIAR Reply Message de Menu List Multi Section
        </button>
        <button class="button" @click="sendReplyMessageInReplyToReplyButton">
          ENVIAR Reply Message de Reply Buttton
        </button>
        <button
          class="button"
          @click="sendReplyMessageInReplyToReplyButtonWithoutHeader"
        >
          ENVIAR Reply Message de Reply Buttton sem header
        </button>
        <button class="button" @click="sendReactionToText">
          ENVIAR Reaction de texto
        </button>
        <button class="button" @click="sendReactionToAudio">
          ENVIAR Reaction de áudio
        </button>
        <button class="button" @click="sendReactionToVoice">
          ENVIAR Reaction de voice
        </button>
        <button class="button" @click="sendReactionToVideo">
          ENVIAR Reaction de vídeo
        </button>
        <button class="button" @click="sendReactionToImage">
          ENVIAR Reaction de imagem
        </button>
        <button class="button" @click="sendReactionToSticker">
          ENVIAR Reaction de sticker
        </button>
        <button class="button" @click="sendReactionToFile">
          ENVIAR Reaction de arquivo
        </button>
        <button class="button" @click="sendReactionToLocation">
          ENVIAR Reaction de location
        </button>
        <button class="button" @click="sendReactionToWebLink">
          ENVIAR Reaction de web link
        </button>
        <button class="button" @click="sendReactionRemoved">
          ENVIAR remover reação
        </button>
        <button class="button" @click="sendReactionToUnsuportedContent">
          ENVIAR reação conteúdo não suportado
        </button>
        <button class="button" @click="sendCopyAndPaste">
          ENVIAR copia e cola
        </button>
        <button class="button" @click="sendThreadSummary">
          ENVIAR Resumo da conversa
        </button>
        <button class="button" @click="sendExternalMessageText">
          ENVIAR mensagem de texto externa
        </button>
        <button class="button" @click="sendExternalMessageImage">
          ENVIAR mensagem de imagem externa
        </button>
      </div>

      <div v-else>
        <h1>JSON:</h1>
        <textarea
          v-model="json"
          id="textarea"
          style="width: 100%; height: 300px"
        ></textarea>
        <button class="button" @click="send">ENVIAR JSON</button>
      </div>
    </div>

    <div
      class="ss-container light-theme"
      v-if="showBlipGroupCard"
      :style="
        'float: left; width:' + width + 'px; margin: 50px 100px; height: 800px;'
      "
      v-chat-scroll="{ scrollToTop: false, onScroll }"
    >
      <div style="padding: 20px">
        <blip-group-card
          v-if="group"
          :failed-to-send-msg="translations.failedToSend"
          :documents="docs"
          :photo="photoUri"
          :deletable="deletable"
          :on-selected="selected"
          :hide-options="false"
          :on-save="save"
          :on-deleted="deleted"
          :editable="editable"
          :on-open-link="selected"
          :on-unsupported-type="onUnsupportedType"
          :on-location-error="selected"
          :disable-link="disableLink"
          :readonly="readonly"
        />
        <div v-else v-for="(item, index) in docs" v-bind:key="index">
          <blip-card
            :photo="item.photo"
            :position="item.position"
            :deletable="deletable"
            :date="item.date"
            :on-selected="selected"
            :hide-options="false"
            :document="item.document"
            :status="item.status"
            :on-save="save"
            :on-deleted="deleted"
            :editable="editable"
            :on-open-link="selected"
            :on-unsupported-type="onUnsupportedType"
            :on-location-error="selected"
            :disable-link="disableLink"
            :readonly="readonly"
          />
        </div>
      </div>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>
import blipCallsStatus from './enums/blipCallsStatus.enum'
import blipCallsType from './enums/blipCallsType.enum'

export default {
  name: 'App',
  computed: {
    docs: function() {
      return this.documents.map((x) => {
        return { ...x, photo: this.photo ? this.photoUri : '' }
      })
    },
    photoUri() {
      return this.photo ? 'http://placehold.it/25x25' : false
    }
  },
  mounted() {
    setTimeout(() => {
      this.send()
    }, 500)
  },
  methods: {
    onScroll: function(e) {},
    send: function() {
      const doc = JSON.parse(this.json)
      if (this.isExternalMessage) {
        doc.metadata = {
          ...doc.metadata,
          '#messageEmitter': 'externalMessages'
        }
      }

      if (this.hasMemberData) {
        doc.metadata = {
          ...doc.metadata,
          '#memberName': this.memberName,
          '#memberPhoneNumber': this.memberPhone
        }
      }

      this.documents.push({
        document: doc,
        date: this.date,
        position: this.position,
        status: this.msgStatus
      })
    },
    sendText: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'text/plain',
        content: 'Seja bem-vindo ao nosso serviço! Como podemos te ajudar?'
      })
      this.send()
    },
    sendTextEmail: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'text/plain',
        content: 'Este é um exemplo de email valido: teste-blip@take.net'
      })
      this.send()
    },
    sendQuickReply: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'application/vnd.lime.select+json',
        content: {
          scope: 'immediate',
          text: 'Choose an option',
          options: [
            { text: 'First option' },
            { order: '2', text: 'Second option' },
            {
              order: '3',
              text: 'Third option',
              type: 'application/json',
              value: { key1: 'value1', key2: '2' }
            }
          ]
        }
      })
      this.send()
    },
    sendMenu: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'application/vnd.lime.select+json',
        content: {
          text: 'Choose an option',
          options: [
            { text: 'First option' },
            { order: '2', text: 'Second option' },
            {
              order: '3',
              text: 'Third option',
              type: 'application/json',
              value: { key1: 'value1', key2: '2' }
            }
          ]
        }
      })
      this.send()
    },
    sendMultimediaMenu: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '1042221589186385@messenger.gw.msging.net',
        type: 'application/vnd.lime.document-select+json',
        content: {
          header: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              title: 'Welcome to mad hatter',
              text: 'Here we have the best hats for your head.',
              type: 'image/jpeg',
              uri:
                'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg',
              aspectRatio: '1:1'
            }
          },
          options: [
            {
              label: {
                type: 'application/vnd.lime.web-link+json',
                value: {
                  text: 'Go to our site',
                  uri:
                    'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg'
                }
              }
            },
            {
              label: { type: 'text/plain', value: 'Show stock' },
              value: {
                type: 'application/json',
                value: { action: 'show-items' }
              }
            }
          ]
        }
      })
      this.send()
    },
    sendCollection: function() {
      this.json = JSON.stringify({
        id: '5',
        to: '1042221589186385@messenger.gw.msging.net',
        type: 'application/vnd.lime.collection+json',
        content: {
          itemType: 'application/vnd.lime.document-select+json',
          items: [
            {
              header: {
                type: 'application/vnd.lime.media-link+json',
                value: {
                  title: 'Title',
                  text: 'This is a first item',
                  type: 'image/jpeg',
                  uri:
                    'http://www.isharearena.com/wp-content/uploads/2012/12/wallpaper-281049.jpg'
                }
              },
              options: [
                {
                  label: {
                    type: 'application/vnd.lime.web-link+json',
                    value: {
                      title: 'Link',
                      uri: 'https://server.com/first/link1'
                    }
                  }
                },
                {
                  label: { type: 'text/plain', value: 'Text 1' },
                  value: {
                    type: 'application/json',
                    value: { key1: 'value1', key2: 2 }
                  }
                }
              ]
            },
            {
              header: {
                type: 'application/vnd.lime.media-link+json',
                value: {
                  title: 'Title 2',
                  text: 'This is another item',
                  type: 'image/jpeg',
                  uri:
                    'http://www.freedigitalphotos.net/images/img/homepage/87357.jpg'
                }
              },
              options: [
                {
                  label: {
                    type: 'application/vnd.lime.web-link+json',
                    value: {
                      title: 'Second link',
                      text: 'Weblink',
                      uri: 'https://server.com/second/link2'
                    }
                  }
                },
                {
                  label: { type: 'text/plain', value: 'Second text' },
                  value: {
                    type: 'application/json',
                    value: { key3: 'value3', key4: 4 }
                  }
                },
                {
                  label: { type: 'text/plain', value: 'More one text' },
                  value: {
                    type: 'application/json',
                    value: { key5: 'value5', key6: '6' }
                  }
                }
              ]
            }
          ]
        }
      })
      this.send()
    },
    sendImage: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'application/vnd.lime.media-link+json',
        content: {
          type: 'image/jpeg',
          uri:
            'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg',
          size: '1'
        }
      })
      this.send()
    },
    sendSticker: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'application/vnd.lime.media-link+json',
        content: {
          type: 'sticker/webp',
          uri:
            'https://blog.jiayu.co/2019/07/telegram-animated-stickers/sticker.webp'
        }
      })
      this.send()
    },
    sendAudio: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'application/vnd.lime.media-link+json',
        content: {
          type: 'audio/mp3',
          uri: 'https://sample-videos.com/audio/mp3/crowd-cheering.mp3',
          size: '1'
        }
      })
      this.send()
    },
    sendVoice: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'application/vnd.lime.media-link+json',
        content: {
          type: 'voice/mp3',
          uri: 'https://samples-files.com/samples/Audio/mp3/sample-file-1.mp3',
          size: '1'
        }
      })
      this.send()
    },
    sendVideo: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'application/vnd.lime.media-link+json',
        content: {
          type: 'video/mp4',
          uri:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          size: '1'
        }
      })
      this.send()
    },
    sendWebLink: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '553199991111@0mn.io',
        type: 'application/vnd.lime.web-link+json',
        content: {
          uri: 'http://limeprotocol.org/content-types.html#web-link',
          target: 'self',
          text: 'Segue documentação do web-link'
        }
      })
      this.send()
    },
    sendFile: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'application/vnd.lime.media-link+json',
        content: {
          uri:
            'https://gradcollege.okstate.edu/sites/default/files/PDF_linking.pdf',
          title: 'pdf_open_parameters.pdf',
          type: 'application/pdf',
          size: '5540'
        }
      })
      this.send()
    },
    sendLocation: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '1042221589186385@messenger.gw.msging.net',
        type: 'application/vnd.lime.location+json',
        content: {
          latitude: -19.918899,
          longitude: -43.959275,
          altitude: 853,
          text: 'Takes place'
        }
      })
      this.send()
    },
    sendRequestLocation: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '1042221589186385@messenger.gw.msging.net',
        type: 'application/vnd.lime.input+json',
        content: {
          label: { type: 'text/plain', value: 'Send your location please!' },
          validation: {
            rule: 'type',
            type: 'application/vnd.lime.location+json'
          }
        }
      })
      this.send()
    },
    sendChatState: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '104222@telegram.gw.msging.net',
        type: 'application/vnd.lime.chatstate+json',
        content: {
          state: 'composing'
        }
      })
      this.send()
    },
    sendTicket() {
      this.json = JSON.stringify({
        id: '1',
        to: '104222@telegram.gw.msging.net',
        type: 'application/vnd.iris.ticket+json',
        content: {
          id: '8b337066-b6e9-43a4-b951-3f961e48c127',
          sequentialId: 313,
          sequentialSuffix: 'SFX',
          ownerIdentity: 'testebuilderluiz@msging.net',
          customerIdentity:
            '4cdbb741-160a-4d77-ba8e-53b54d6225e3.testebuilderluiz@0mn.io',
          customerDomain: '0mn.io',
          provider: 'Lime',
          status: 'Waiting',
          storageDate: '2018-06-28T16:19:09.110Z',
          externalId: '8b337066-b6e9-43a4-b951-3f961e48c127',
          rating: 0,
          team: 'Default',
          unreadMessages: 0,
          closed: false
        }
      })
      this.send()
    },
    sendCallsVoiceEnd() {
      this.json = JSON.stringify({
        id: '1',
        to: '104222@telegram.gw.msging.net',
        type: 'application/vnd.iris.calls.media+json',
        content: {
          type: blipCallsType.voice,
          status: blipCallsStatus.answer,
          identification: '+55 84 966956332',
          media: {
            type: 'application/vnd.lime.media-link+json',
            content: {
              type: 'audio/mp4',
              uri: 'https://sample-videos.com/audio/mp3/crowd-cheering.mp3',
              size: '1'
            }
          }
        }
      })
      this.send()
    },
    sendCallsVideoEnd() {
      this.json = JSON.stringify({
        id: '1',
        to: '104222@telegram.gw.msging.net',
        type: 'application/vnd.iris.calls.media+json',
        content: {
          type: blipCallsType.video,
          status: blipCallsStatus.answer,
          identification: '1234513',
          media: {
            type: 'application/vnd.lime.media-link+json',
            content: {
              type: 'video/mp4',
              uri:
                'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              size: '1'
            }
          }
        }
      })
      this.send()
    },
    sendNoAnswerCallsVoiceEnd() {
      this.json = JSON.stringify({
        id: '1',
        to: '104222@telegram.gw.msging.net',
        type: 'application/vnd.iris.calls.media+json',
        content: {
          type: blipCallsType.voice,
          status: blipCallsStatus.noAnswer,
          identification: '+55 84 966956332'
        }
      })
      this.send()
    },
    sendNoAnswerCallsVideoEnd() {
      this.json = JSON.stringify({
        id: '1',
        to: '104222@telegram.gw.msging.net',
        type: 'application/vnd.iris.calls.media+json',
        content: {
          type: blipCallsType.video,
          status: blipCallsStatus.noAnswer,
          identification: '1234513'
        }
      })
      this.send()
    },
    sendCallsVoiceRequest() {
      this.json = JSON.stringify({
        id: '1',
        to: '104222@telegram.gw.msging.net',
        type: 'application/json',
        content: {
          recipient_type: 'individual',
          type: 'interactive',
          interactive: {
            type: 'voice_call',
            body: {
              text:
                'Olá! Para um atendimento mais rápido, você pode entrar em contato através de uma chamada WhatsApp.'
            },
            action: {
              name: 'voice_call',
              parameters: {
                display_text: 'Ligar agora'
              }
            }
          }
        }
      })
      this.send()
    },
    sendRaw: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '104222@telegram.gw.msging.net',
        type: 'application/vnd.lime.chatstater+json',
        content: {
          state: 'composing'
        }
      })
      this.send()
    },
    sendApplicationJsonUnsupportedContent: function() {
      this.json = JSON.stringify({
        id: '16b0d902-7487-4c5c-b49c-8103558621e7',
        direction: 'sent',
        type: 'application/json',
        content: {
          recipient_type: 'unsupported',
          type: 'unsupported'
        }
      })
      this.send()
    },
    sendSurveyContent: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '104222@telegram.gw.msging.net',
        type: 'application/vnd.lime.satisfaction-survey+json',
        content: {
          type: 'recomendationSurvey',
          scale: 'numeric5',
          question: 'Would you recommend our product? Rate us',
          score: 0
        }
      })
      this.send()
    },
    sendContact: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@wa.gw.msging.net',
        type: 'application/vnd.lime.contact+json',
        content: {
          name: 'My Test Contact Name',
          email: 'mycontact@take.net',
          phoneNumber: '+55 33 3131-3131',
          cellPhoneNumber: '+55 33 93131-3131',
          address: 'Contact Address, 1000',
          extras: {
            org: 'Take Blip'
          },
          firstName: 'Contact',
          lastName: 'Last Name'
        }
      })
      this.send()
    },
    sendCallToAction: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@wa.gw.msging.net',
        type: 'application/json',
        content: {
          recipient_type: 'individual',
          type: 'interactive',
          interactive: {
            type: 'cta_url',
            header: {
              text: 'Available Dates'
            },
            body: {
              text: 'Tap the button below to see available dates.'
            },
            footer: {
              text: 'Dates subject to change.'
            },
            action: {
              name: 'cta_url',
              parameters: {
                display_text: 'See Dates',
                url:
                  'https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-cta-url-messages'
              }
            }
          }
        }
      })
      this.send()
    },
    sendJsonText: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@wa.gw.msging.net',
        type: 'application/json',
        content: {
          recipient_type: 'individual',
          type: 'interactive',
          interactive: {
            type: 'flow',
            header: {
              text: 'text'
            },
            body: {
              text: 'Teste'
            },
            footer: {
              text: 'Energisa'
            },
            action: {
              name: 'flow',
              parameters: {
                flow_message_version: '200',
                flow_id: '356521493857549',
                flow_cta: 'ver',
                flow_action: 'navigate',
                flow_token: 'unused',
                flow_action_payload: {
                  screen: 'PREFERENCES'
                }
              }
            }
          }
        }
      })
      this.send()
    },
    sendMenuList: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@wa.gw.msging.net',
        type: 'application/json',
        content: {
          recipient_type: 'individual',
          type: 'interactive',
          interactive: {
            type: 'list',
            header: {
              type: 'text',
              text: 'E então, com qual assunto posso te ajudar?'
            },
            body: {
              text: 'Clique para abrir as opções 👇'
            },
            action: {
              button: 'Escolher assunto',
              sections: [
                {
                  rows: [
                    {
                      id: 'id:1.0',
                      title: '🤖 Como funciona?',
                      description:
                        'Entender como o Blip funciona, seus benefícios, preços e mais'
                    },
                    {
                      id: 'id:1.1',
                      title: '🤝 Contratar Take Blip',
                      description:
                        'Quero conversar com o time de vendas para tirar dúvidas e contratar'
                    },
                    {
                      id: 'id:1.2',
                      title: '💬 Já uso o Blip',
                      description:
                        'Se você é cliente Take Blip e precisa de ajuda ou suporte, clique aqui'
                    },
                    {
                      id: 'id:1.3',
                      title: '👥 Parceria',
                      description: 'Tenho interesse em ser uma empresa parceira'
                    }
                  ]
                }
              ]
            }
          }
        }
      })
      this.send()
    },
    sendMenuListMultiSection: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@wa.gw.msging.net',
        type: 'application/json',
        content: {
          type: 'interactive',
          interactive: {
            type: 'list',
            header: {
              type: 'text',
              text: 'header-content'
            },
            body: {
              text: 'text-body-content'
            },
            footer: {
              text: 'footer-content'
            },
            action: {
              button: 'Choose subject',
              sections: [
                {
                  title: 'Section 1',
                  rows: [
                    {
                      id: '1',
                      title: '💬 My row 1',
                      description: 'My row 1 description'
                    },
                    {
                      id: '2',
                      title: '🤖 My row 2',
                      description: 'My row 2 description'
                    },
                    {
                      id: '3',
                      title: 'My row 3',
                      description: 'My row 3 description'
                    },
                    {
                      id: '4',
                      title: 'My row 4',
                      description: 'My row 4 description'
                    }
                  ]
                },
                {
                  title: 'Section 2',
                  rows: [
                    {
                      id: '5',
                      title: '💬 My row 5',
                      description: 'My row 5 description'
                    },
                    {
                      id: '6',
                      title: '🤖 My row 6',
                      description: 'My row 6 description'
                    },
                    {
                      id: '7',
                      title: 'My row 7',
                      description: 'My row 7 description'
                    },
                    {
                      id: '8',
                      title: 'My row 8',
                      description: 'My row 8 description'
                    }
                  ]
                }
              ]
            }
          }
        }
      })
      this.send()
    },
    sendReplyButton: function() {
      this.json = JSON.stringify({
        id: '16b0d902-7487-4c5c-b49c-8103558621e7',
        direction: 'sent',
        type: 'application/json',
        content: {
          recipient_type: 'individual',
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: 'conteúdo de teste'
            },
            action: {
              buttons: [
                {
                  type: 'reply',
                  reply: {
                    id: '1',
                    title: 'botão 1'
                  }
                },
                {
                  type: 'reply',
                  reply: {
                    id: '2',
                    title: 'botão 2'
                  }
                },
                {
                  type: 'reply',
                  reply: {
                    id: '3',
                    title: 'botão 3'
                  }
                }
              ]
            },
            header: {
              type: 'image',
              text: 'take image',
              image: {
                link:
                  'https://sindinfor.org.br/wp-content/uploads/2020/10/take-og-image.png'
              }
            },
            footer: {
              text: 'rodapé de testes'
            }
          }
        }
      })
      this.send()
    },
    sendReplyMessage: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'text/plain',
            value: 'replied text'
          },
          inReplyTo: {
            id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
            type: 'text/plain',
            value: 'in reply to text'
          }
        }
      })
      this.send()
    },
    sendReplyMessage1: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'text/plain',
            value: 'replied text'
          },
          inReplyTo: {
            id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
            type: 'image/png',
            value: {
              type: 'image/png',
              size: 174999,
              uri:
                'https://hmgmediastore.blip.ai/secure-medias/Media_efba7ff9-1006-45b4-af5e-92fe593545bf?sv=2024-05-04&st=2024-10-02T20%3A35%3A32Z&se=2024-10-02T21%3A05%3A32Z&sr=b&sp=r&sig=MWLAOx1LVqyDzVXn2CkRrDFwwnJynWdwuQ5Lq317C%2Bo%3D&secure=true',
              previewUri:
                'https://k8s-hmg-media.msging.net/media/download/MDpNZWRpYV9lZmJhN2ZmOS0xMDA2LTQ1YjQtYWY1ZS05MmZlNTkzNTQ1YmY=',
              previewType: 'image/png',
              title: 'Chatblip_plataforma.png',
              text: '',
              authorizationRealm: 'blip'
            }
          }
        }
      })
      this.send()
    },
    sendReplyTextMessageWithDocument: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              type: 'application/pdf',
              uri:
                'https://blipmediastore.blob.core.windows.net/secure-medias/Media_53990e61-03e2-41e0-ad28-97a2100ee472933743904372393?sv=2019-07-07&st=2023-06-30T21%3A24%3A48Z&se=2023-06-30T21%3A54%3A48Z&sr=b&sp=r&sig=ZXh4OvaM7mGj2%2BrgfPl%2ByLrX4WwV03pvtm0%2BlAplLLI%3D&secure=true',
              title: 'my_pdf.pdf',
              size: '5540'
            }
          },
          inReplyTo: {
            id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
            type: 'text/plain',
            value: 'in reply to text'
          }
        }
      })
      this.send()
    },
    sendReplyTextMessageWithVideo: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              type: 'video/mp4',
              uri:
                'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
            }
          },
          inReplyTo: {
            id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
            type: 'text/plain',
            value: 'in reply to Video'
          }
        }
      })
      this.send()
    },
    sendReplyTextMessageWithAudio: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              type: 'audio/mp3',
              uri: 'https://sample-videos.com/audio/mp3/crowd-cheering.mp3'
            }
          },
          inReplyTo: {
            id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
            type: 'text/plain',
            value: 'in reply to Audio'
          }
        }
      })
      this.send()
    },
    sendReplyTextMessageWithImage: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              type: 'image/jpeg',
              uri:
                'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg'
            }
          },
          inReplyTo: {
            id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
            type: 'text/plain',
            value: 'in reply to Imagem'
          }
        }
      })
      this.send()
    },
    sendReplyMessageInReplyToMenu: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'text/plain',
            value: 'replied text'
          },
          inReplyTo: {
            id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
            type: 'application/vnd.lime.select+json',
            value: {
              scope: 'immediate',
              text: 'Choose an option',
              options: [
                { text: 'First option' },
                { order: '2', text: 'Second option' },
                {
                  order: '3',
                  text: 'Third option',
                  type: 'application/json',
                  value: { key1: 'value1', key2: '2' }
                }
              ]
            }
          }
        }
      })
      this.send()
    },
    sendReplyMessageInReplyToMenuList: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'text/plain',
            value: 'replied text'
          },
          inReplyTo: {
            type: 'application/json',
            value: {
              recipient_type: 'individual',
              type: 'interactive',
              interactive: {
                type: 'list',
                header: {
                  type: 'text',
                  text: 'E então, com qual assunto posso te ajudar?'
                },
                body: {
                  text: 'Clique para abrir as opções 👇'
                },
                action: {
                  button: 'Escolher assunto',
                  sections: [
                    {
                      rows: [
                        {
                          id: 'id:1.0',
                          title: '🤖 Como funciona?',
                          description:
                            'Entender como o Blip funciona, seus benefícios, preços e mais'
                        },
                        {
                          id: 'id:1.1',
                          title: '🤝 Contratar Take Blip',
                          description:
                            'Quero conversar com o time de vendas para tirar dúvidas e contratar'
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      })
      this.send()
    },
    sendReplyMessageInReplyToMenuListMultiSection: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'text/plain',
            value: 'replied text'
          },
          inReplyTo: {
            type: 'application/json',
            value: {
              type: 'interactive',
              interactive: {
                type: 'list',
                header: {
                  type: 'text',
                  text: 'header-content'
                },
                body: {
                  text: 'text-body-content'
                },
                footer: {
                  text: 'footer-content'
                },
                action: {
                  button: 'Choose subject',
                  sections: [
                    {
                      title: 'Section 1',
                      rows: [
                        {
                          id: '1',
                          title: '💬 My row 1',
                          description: 'My row 1 description'
                        }
                      ]
                    },
                    {
                      title: 'Section 2',
                      rows: [
                        {
                          id: '2',
                          title: '💬 My row 2',
                          description: 'My row 2 description'
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      })
      this.send()
    },
    sendReplyMessageInReplyToReplyButton: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'text/plain',
            value: 'replied text'
          },
          inReplyTo: {
            type: 'application/json',
            value: {
              recipient_type: 'individual',
              type: 'interactive',
              interactive: {
                type: 'button',
                body: {
                  text: 'conteúdo de teste'
                },
                action: {
                  buttons: [
                    {
                      type: 'reply',
                      reply: {
                        id: '1',
                        title: 'botão 1'
                      }
                    },
                    {
                      type: 'reply',
                      reply: {
                        id: '2',
                        title: 'botão 2'
                      }
                    }
                  ]
                },
                header: {
                  type: 'text',
                  text: 'header de teste'
                },
                footer: {
                  text: 'rodapé de testes'
                }
              }
            }
          }
        }
      })
      this.send()
    },
    sendReplyMessageInReplyToReplyButtonWithoutHeader: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reply+json',
        content: {
          replied: {
            type: 'text/plain',
            value: 'replied text'
          },
          inReplyTo: {
            type: 'application/json',
            value: {
              recipient_type: 'individual',
              type: 'interactive',
              interactive: {
                type: 'button',
                body: {
                  text: 'conteúdo de teste'
                },
                action: {
                  buttons: [
                    {
                      type: 'reply',
                      reply: {
                        id: '1',
                        title: 'botão 1'
                      }
                    },
                    {
                      type: 'reply',
                      reply: {
                        id: '2',
                        title: 'botão 2'
                      }
                    }
                  ]
                },
                footer: {
                  text: 'rodapé de testes'
                }
              }
            }
          }
        }
      })
      this.send()
    },
    sendThreadSummary: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.iris.desk.thread-summary+json',
        content: {
          id: '44528dc9-3174-41f1-8188-0189ae0666d2',
          sequentialId: 11,
          ownerIdentity: 'whatsappcloudapi@msging.net',
          customerIdentity: '5531992722620@wa.gw.msging.net',
          team: 'Maria',
          parentSequentialId: 10,
          priority: 6,
          isLoading: false,
          summary: [
            'Cliente entrou em contato e iniciou atendimento pelo bot, selecionando as opções de atendimento e cancelamento.',
            'Inicialmente, a empresa ofereceu um desconto de 10%, mas o cliente não considerou suficiente.',
            'Após nova negociação, chegaram a um acordo de 20% de desconto, com a condição de fidelidade de 6 meses.'
          ]
        }
      })
      this.send()
    },
    sendReactionToText: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        content: {
          emoji: {
            values: [128077]
          },
          inReactionTo: {
            id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
            type: 'text/plain',
            value: 'teste',
            direction: 'sent'
          }
        }
      })
      this.send()
    },
    sendReactionRemoved: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        content: {
          inReactionTo: {
            id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
            type: 'text/plain',
            value: 'teste',
            direction: 'sent'
          },
          emoji: undefined
        }
      })
      this.send()
    },
    sendReactionToAudio: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        content: {
          inReactionTo: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              type: 'audio/mp3',
              uri:
                'https://upload.wikimedia.org/wikipedia/commons/6/63/Sagetyrtle_-_citystreet3_%28cc0%29_%28freesound%29.mp3'
            },
            direction: 'sent'
          },
          emoji: {
            values: [55357, 56397, 55356, 57341]
          }
        }
      })
      this.send()
    },
    sendReactionToVoice: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        content: {
          inReactionTo: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              type: 'voice/mp3',
              uri:
                'https://upload.wikimedia.org/wikipedia/commons/6/63/Sagetyrtle_-_citystreet3_%28cc0%29_%28freesound%29.mp3'
            },
            direction: 'sent'
          },
          emoji: {
            values: [55357, 56397, 55356, 57341]
          }
        }
      })
      this.send()
    },
    sendReactionToVideo: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        content: {
          inReactionTo: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              type: 'video/mp4',
              uri:
                'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
            },
            direction: 'sent'
          },
          emoji: {
            values: [55357, 56397, 55356, 57341]
          }
        }
      })
      this.send()
    },
    sendReactionToImage: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        content: {
          inReactionTo: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              type: 'image/jpeg',
              uri:
                'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg',
              title: 'texto de exemplo'
            },
            direction: 'sent'
          },
          emoji: {
            values: [55357, 56397, 55356, 57341]
          }
        }
      })
      this.send()
    },
    sendReactionToSticker: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        content: {
          inReactionTo: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              type: 'sticker/webp',
              uri:
                'https://res.cloudinary.com/demo/image/upload/fl_awebp,q_40/bored_animation.webp'
            },
            direction: 'sent'
          },
          emoji: {
            values: [55357, 56397, 55356, 57341]
          }
        }
      })
      this.send()
    },
    sendReactionToUnsuportedContent: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        direction: 'sent',
        content: {
          inReactionTo: {
            type: 'application/vnd.lime.chatstater+json',
            value: {
              state: 'composing'
            }
          },
          emoji: {
            values: [55357, 56397, 55356, 57341]
          }
        }
      })
      this.send()
    },
    sendReactionToFile: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        content: {
          inReactionTo: {
            type: 'application/vnd.lime.media-link+json',
            value: {
              uri:
                'https://gradcollege.okstate.edu/sites/default/files/PDF_linking.pdf',
              title: 'pdf_open_parameters.pdf',
              type: 'application/pdf',
              size: '5540'
            },
            direction: 'sent'
          },
          emoji: {
            values: [55357, 56397, 55356, 57341]
          }
        }
      })
      this.send()
    },
    sendReactionToLocation: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        content: {
          inReactionTo: {
            type: 'application/vnd.lime.location+json',
            value: {
              latitude: -19.918899,
              longitude: -43.959275,
              altitude: 853,
              text: 'Takes place'
            },
            direction: 'sent'
          },
          emoji: {
            values: [55357, 56397, 55356, 57341]
          }
        }
      })
      this.send()
    },
    sendReactionToWebLink: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.reaction+json',
        content: {
          inReactionTo: {
            type: 'application/vnd.lime.web-link+json',
            value: {
              uri: 'http://limeprotocol.org/content-types.html#web-link',
              target: 'self',
              text: 'Segue documentação do web-link'
            },
            direction: 'sent'
          },
          emoji: {
            values: [55357, 56397, 55356, 57341]
          }
        }
      })
      this.send()
    },
    sendCopyAndPaste: function() {
      this.json = JSON.stringify({
        id: 'b1c3398f-ef63-426d-98b8-37ca84478f8f',
        to: 'to@msging.net',
        from: 'from@msging.net',
        type: 'application/vnd.lime.copy-and-paste+json',
        content: {
          header: 'Segue o código',
          body: 'Clique no botão abaixo para copiar o código Pix.',
          footer: 'O código expira em 10 minutos.',
          button: {
            text: 'Copiar código Pix',
            value: 'Value'
          }
        }
      })
      this.send()
    },
    sendExternalMessageImage: function() {
      this.json = JSON.stringify({
        id: 'ce8cbbe1-83c1-40ea-80bd-9cf0be4d573e',
        from: 'from@wa.gw.msging.net',
        to: 'to@wa.gw.msging.net',
        type: 'application/vnd.lime.external+json',
        content: {
          type: 'application/vnd.lime.media-link+json',
          content: {
            type: 'image/jpeg',
            uri:
              'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg',
            size: '1'
          }
        }
      })
      this.send()
    },
    sendExternalMessageText: function() {
      this.json = JSON.stringify({
        id: 'ce8cbbe1-83c1-40ea-80bd-9cf0be4d573e',
        from: 'from@wa.gw.msging.net',
        to: 'to@wa.gw.msging.net',
        type: 'application/vnd.lime.external+json',
        content: {
          type: 'text/plain',
          content: 'Messagem de Eco'
        }
      })
      this.send()
    },
    onUnsupportedType: function(document) {},
    toogleBlipGroupCard: function() {
      this.showBlipGroupCard = !this.showBlipGroupCard
    }
  },
  data: function() {
    return {
      documents: [],
      json: JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'text/plain',
        content: 'Seja bem-vindo ao nosso serviço! Como podemos te ajudar?'
      }),
      width: 700,
      position: 'left',
      isSample: 'true',
      date: '08:32 PM',
      photo: false,
      group: false,
      msgStatus: 'accepted',
      selected: function(d) {},
      save: function(d) {},
      deleted: function(d) {},
      showBlipGroupCard: true,
      disableLink: false,
      editable: true,
      deletable: true,
      readonly: false,
      translations: {
        failedToSend: 'Falha ao enviar a mensagem.',
        unsupportedContent: 'Conteúdo não suportado'
      },
      isExternalMessage: false,
      hasMemberData: false,
      memberName: undefined,
      memberPhone: undefined
    }
  },
  components: {}
}
</script>

<style lang="scss">
@import 'styles/variables.scss';

.light-theme {
  background-color: $color-surface-2;
}

.float {
  float: left;
  padding: 20px;
}

.button {
  background-color: $vue-breeze;
  border: solid 1px $vue-city;
  border-radius: 5px;
  width: 100%;
  padding: 3px;
  margin-top: 10px;
}
</style>
