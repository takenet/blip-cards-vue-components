<template>
  <div>
    <div class="float" style="width: 200px">
      <div>
        <h1>Width:</h1>
        <input v-model="width" >
      </div>

      <div>
        <h1>Position:</h1>
        <input type="radio" value="left" v-model="position" > LEFT
        <input type="radio" value="right" v-model="position" > RIGHT
      </div>

      <div>
        <h1>Date:</h1>
        <input v-model="date" >
      </div>

      <div style="clear: both">
      </div>

      <br />

      <input type="radio" value="true" v-model="isSample" > Samples
      <input type="radio" value="false" v-model="isSample" > JSON
      <input type="checkbox" value="false" v-model="photo" > Show Photo

      <div v-if="isSample === 'true'">
        <h1>Examples:</h1>
        <button class="button" @click="sendText">ENVIAR Texto</button>
        <button class="button" @click="sendMenu">ENVIAR Menu</button>
        <button class="button" @click="sendQuickReply">ENVIAR QuickReply</button>
        <button class="button" @click="sendMultimediaMenu">ENVIAR Menu Multimídia</button>
        <button class="button" @click="sendCollection">ENVIAR Coleção</button>
        <button class="button" @click="sendImage">ENVIAR Imagem</button>
        <button class="button" @click="sendAudio">ENVIAR Audio</button>
        <button class="button" @click="sendVideo">ENVIAR Video</button>
        <button class="button" @click="sendWebLink">ENVIAR WebLink</button>
        <button class="button" @click="sendFile">ENVIAR Documento</button>
        <button class="button" @click="sendLocation">ENVIAR Location</button>
        <button class="button" @click="sendRequestLocation">ENVIAR Pedido de Localização</button>
        <button class="button" @click="sendChatState">ENVIAR Chatstate</button>
        <button class="button" @click="sendRaw">ENVIAR Raw Content</button>
      </div>

      <div v-else>
        <h1>JSON:</h1>
        <textarea v-model="json" id='textarea' style="width: 100%; height: 300px;"></textarea>
        <button class="button" @click="send">ENVIAR JSON</button>
      </div>
    </div>

    <div :style="'float: left; width:' + width + 'px; margin: 50px 100px; background-color: #FAF9F8; padding: 20px; height: 800px;'" v-chat-scroll="{scrollToTop: false}">
      <div>
        <div v-for="(item, index) in documents" v-bind:key="index">
          <blip-card :photo="photoUri" :position="item.position" :deletable="true" :date="item.date" :on-selected="selected" :hide-options="false" :document="item.document" :on-save="save" :on-deleted="deleted" :editable="true" :on-open-link="selected" :on-unsupported-type="onUnsupportedType" :on-location-error="selected"/>
        </div>
      </div>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    docs: function() {
      return this.documents.map((x) => {
        return x.document
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
    send: function() {
      this.documents.push({
        document: JSON.parse(this.json),
        date: this.date,
        position: this.position
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
    sendQuickReply: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'application/vnd.lime.select+json',
        content: {
          scope: 'immediate',
          text: 'Choice an option',
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
          text: 'Choice an option',
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
    sendAudio: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '128271320123982@messenger.gw.msging.net',
        type: 'application/vnd.lime.media-link+json',
        content: {
          type: 'audio/mp3',
          uri: 'http://blaamandagjazzband.dk/jazz/mp3/basin_street_blues.mp3',
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
            'http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_30mb.mp4',
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
          'state': 'composing'
        }
      })
      this.send()
    },
    sendRaw: function() {
      this.json = JSON.stringify({
        id: '1',
        to: '104222@telegram.gw.msging.net',
        type: 'application/vnd.lime.chatstate+json',
        content: {
          'state': 'composing'
        }
      })
      this.send()
    },
    onUnsupportedType: function(document) {}
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
      selected: function(d) {},
      save: function(d) {},
      deleted: function(d) {}
    }
  },
  components: {}
}
</script>


<style lang="scss">
@import 'styles/variables.scss';

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
