<template>
  <div>
    <div class="float" style="width: 150px">
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

      <div>
        <h1>Examples:</h1>
        <button class="button" @click="sendText">ENVIAR Texto</button>
        <button class="button" @click="sendMenu">ENVIAR Menu</button>
        <button class="button" @click="sendMultimediaMenu">ENVIAR Menu Multimídia</button>
        <button class="button" @click="sendCollection">ENVIAR Coleção</button>
        <button class="button" @click="sendImage">ENVIAR Imagem</button>
        <button class="button"  @click="sendAudio">ENVIAR Audio</button>
        <button class="button" @click="sendVideo">ENVIAR Video</button>
      </div>

      <div>
        <h1>JSON:</h1>
        <textarea v-model="json" id='textarea' style="width: 100%; height: 300px;"></textarea>
        <button class="button" @click="send">ENVIAR JSON</button>
      </div>
    </div>

    <div :style="'float: left; width:' + width + 'px; margin: 50px 100px; background-color: #FAF9F8; padding: 20px;'">
      <div v-for="(item, index) in documents">
        <blip-card :position="item.position" :date="item.date" :on-selected="teste" :hide-options="false" :document="item.document" />
      </div>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    send: function () {
      this.documents.push({ document: JSON.parse(this.json), date: this.date, position: this.position })
    },
    sendText: function () {
      this.json = JSON.stringify({'id': '1', 'to': '128271320123982@messenger.gw.msging.net', 'type': 'text/plain', 'content': 'Seja bem-vindo ao nosso serviço! Como podemos te ajudar?'})
      this.send()
    },
    sendMenu: function () {
      this.json = JSON.stringify({'id': '1', 'to': '128271320123982@messenger.gw.msging.net', 'type': 'application/vnd.lime.select+json', 'content': {'text': 'Choice an option', 'options': [{'text': 'First option'}, {'order': '2', 'text': 'Second option'}, {'order': '3', 'text': 'Third option', 'type': 'application/json', 'value': {'key1': 'value1', 'key2': '2'}}]}})
      this.send()
    },
    sendMultimediaMenu: function () {
      this.json = JSON.stringify({'id': '1', 'to': '1042221589186385@messenger.gw.msging.net', 'type': 'application/vnd.lime.document-select+json', 'content': {'header': {'type': 'application/vnd.lime.media-link+json', 'value': {'title': 'Welcome to mad hatter', 'text': 'Here we have the best hats for your head.', 'type': 'image/jpeg', 'uri': 'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg', 'aspectRatio': '1:1'}}, 'options': [{'label': {'type': 'application/vnd.lime.web-link+json', 'value': {'text': 'Go to our site', 'uri': 'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg'}}}, {'label': {'type': 'text/plain', 'value': 'Show stock'}, 'value': {'type': 'application/json', 'value': {'action': 'show-items'}}}]}})
      this.send()
    },
    sendCollection: function () {
      this.json = JSON.stringify({'id': '5', 'to': '1042221589186385@messenger.gw.msging.net', 'type': 'application/vnd.lime.collection+json', 'content': {'itemType': 'application/vnd.lime.document-select+json', 'items': [{'header': {'type': 'application/vnd.lime.media-link+json', 'value': {'title': 'Title', 'text': 'This is a first item', 'type': 'image/jpeg', 'uri': 'http://www.isharearena.com/wp-content/uploads/2012/12/wallpaper-281049.jpg'}}, 'options': [{'label': {'type': 'application/vnd.lime.web-link+json', 'value': {'title': 'Link', 'uri': 'https://server.com/first/link1'}}}, {'label': {'type': 'text/plain', 'value': 'Text 1'}, 'value': {'type': 'application/json', 'value': {'key1': 'value1', 'key2': 2}}}]}, {'header': {'type': 'application/vnd.lime.media-link+json', 'value': {'title': 'Title 2', 'text': 'This is another item', 'type': 'image/jpeg', 'uri': 'http://www.freedigitalphotos.net/images/img/homepage/87357.jpg'}}, 'options': [{'label': {'type': 'application/vnd.lime.web-link+json', 'value': {'title': 'Second link', 'text': 'Weblink', 'uri': 'https://server.com/second/link2'}}}, {'label': {'type': 'text/plain', 'value': 'Second text'}, 'value': {'type': 'application/json', 'value': {'key3': 'value3', 'key4': 4}}}, {'label': {'type': 'text/plain', 'value': 'More one text'}, 'value': {'type': 'application/json', 'value': {'key5': 'value5', 'key6': '6'}}}]}]}})
      this.send()
    },
    sendImage: function () {
      this.json = JSON.stringify({'id': '1', 'to': '128271320123982@messenger.gw.msging.net', 'type': 'application/vnd.lime.media-link+json', 'content': {'type': 'image/jpeg', 'uri': 'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg', 'size': '1'}})
      this.send()
    },
    sendAudio: function () {
      this.json = JSON.stringify({'id': '1', 'to': '128271320123982@messenger.gw.msging.net', 'type': 'application/vnd.lime.media-link+json', 'content': {'type': 'audio/mp3', 'uri': 'http://blaamandagjazzband.dk/jazz/mp3/basin_street_blues.mp3', 'size': '1'}})

      this.send()
    },
    sendVideo: function () {
      this.json = JSON.stringify({'id': '1', 'to': '128271320123982@messenger.gw.msging.net', 'type': 'application/vnd.lime.media-link+json', 'content': {'type': 'video/mp4', 'uri': 'http://www.onirikal.com/videos/mp4/nestlegold.mp4', 'size': '1'}})

      this.send()
    }
  },
  data: function () {
    return {
      documents: [],
      json: JSON.stringify({'id': '1', 'to': '128271320123982@messenger.gw.msging.net', 'type': 'text/plain', 'content': 'Seja bem-vindo ao nosso serviço! Como podemos te ajudar?'}),
      width: 700,
      position: 'left',
      date: '08:32 PM',
      teste: function (text, obj) {
        console.log(text, obj)
      }
    }
  },
  components: {
  }
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
