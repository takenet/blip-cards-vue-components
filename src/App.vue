<template>
<<<<<<< HEAD
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

      <h1>JSON:</h1>
      <textarea v-model="json" style="width: 100%; height: 300px;"></textarea>

      <button @click="send">ENVIAR</button>
    </div>

    <div :style="'float: left; width:' + width + 'px; margin: 50px 100px; background-color: #FAF9F8; padding: 20px;'">
      <div v-for="(item, index) in documents">
        <blip-card :position="item.position" :date="item.date" :on-selected="teste" :hide-options="false" :document="item.document" />
      </div>
      <div style="clear: both"></div>
    </div>
=======
  <div style="width: 800px; margin: 0 auto; background-color: #FAF9F8; padding: 20px;">

    <collection position="left" date="08:32 PM" :on-selected="teste" :document="{'itemType':'application/vnd.lime.document-select+json','items':[{'header':{'type':'application/vnd.lime.media-link+json','value':{'title':'Titulo','text':'Este é o primeiro item','type':'image/jpeg','uri':'http://www.isharearena.com/wp-content/uploads/2012/12/wallpaper-281049.jpg'}},'options':[{'label':{'type':'application/vnd.lime.web-link+json','value':{'title':'Link','uri':'https://server.com/first/link1'}}},{'label':{'type':'text/plain','value':'Texto 1'},'value':{'type':'application/json','value':{'key1':'value1','key2':2}}}]},{'header':{'type':'application/vnd.lime.media-link+json','value':{'title':'Titulo 2','text':'Este é outro item','type':'image/jpeg','uri':'http://www.freedigitalphotos.net/images/img/homepage/87357.jpg'}},'options':[{'label':{'type':'application/vnd.lime.web-link+json','value':{'title':'Segundo link','text':'Weblink','uri':'https://server.com/second/link2'}}},{'label':{'type':'text/plain','value':'Segundo texto'},'value':{'type':'application/json','value':{'key3':'value3','key4':4}}},{'label':{'type':'text/plain','value':'Mais um texto'},'value':{'type':'application/json','value':{'key5':'value5','key6':6}}}]}]}" />

    <document-select position="left" :on-selected="teste" :document="{'header':{'type':'application/vnd.lime.media-link+json','value':{'title':'Seja bem-vindo ao Chapeleiro Maluco','text':'Aqui temos o melhor chapéu para sua cabeça.','type':'image/jpeg','uri':'https://upload.wikimedia.org/wikipedia/commons/f/ff/Vertical_velocity.jpg','aspectRatio':'2:1'}},'options':[{'label':{'type':'application/vnd.lime.web-link+json','value':{'text':'Visitar site','uri':'https://petersapparel.parseapp.com/view_item?item_id=100'}}},{'label':{'type':'text/plain','value':'Ver estoque'},'value':{'type':'application/json','value':{'action':'show-items'}}}]}" date="08:32 PM"/>
    <document-select position="left" :on-selected="teste" :document="{'header':{'type':'application/vnd.lime.media-link+json','value':{'title':'Seja bem-vindo ao Chapeleiro Maluco','type':'image/jpeg','uri':'http://blog.inpulse.vet.br/wp-content/uploads/2016/10/como-evitar-arranhoes-do-seu-gato.jpg','aspectRatio':'1:1'}},'options':[{'label':{'type':'application/vnd.lime.web-link+json','value':{'text':'Visitar site','uri':'https://petersapparel.parseapp.com/view_item?item_id=100'}}},{'label':{'type':'text/plain','value':'Ver estoque'},'value':{'type':'application/json','value':{'action':'show-items'}}}]}" date="08:32 PM"/>
    <document-select position="left" :on-selected="teste" :document="{'header':{'type':'application/vnd.lime.media-link+json','value':{'text':'Aqui temos o melhor chapéu para sua cabeça.','type':'image/jpeg','uri':'http://blog.inpulse.vet.br/wp-content/uploads/2016/10/como-evitar-arranhoes-do-seu-gato.jpg','aspectRatio':'1:1'}},'options':[{'label':{'type':'application/vnd.lime.web-link+json','value':{'text':'Visitar site','uri':'https://petersapparel.parseapp.com/view_item?item_id=100'}}},{'label':{'type':'text/plain','value':'Ver estoque'},'value':{'type':'application/json','value':{'action':'show-items'}}}]}" date="08:32 PM"/>
    <document-select position="left" :on-selected="teste" :document="{'header':{'type':'application/vnd.lime.media-link+json','value':{'type':'image/jpeg','uri':'http://blog.inpulse.vet.br/wp-content/uploads/2016/10/como-evitar-arranhoes-do-seu-gato.jpg','aspectRatio':'1:1'}},'options':[{'label':{'type':'application/vnd.lime.web-link+json','value':{'text':'Visitar site','uri':'https://petersapparel.parseapp.com/view_item?item_id=100'}}},{'label':{'type':'text/plain','value':'Ver estoque'},'value':{'type':'application/json','value':{'action':'show-items'}}}]}" date="08:32 PM"/>

    <blip-select position="right" :on-selected="teste" :hide-options="true" :document="{'scope': 'immediate','text':'Sem opcoes','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}" date="08:32 PM"/>
    <blip-select position="left" :on-selected="teste" :hide-options="true" :document="{'scope': 'immediate','text':'Sem opcoes','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}" date="08:32 PM"/>

    <blip-select position="right" :on-selected="teste" :hide-options="false" :document="{'scope': 'immediate','text':'!@#º😞\nEscolha uma opção','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}" date="08:32 PM"/>
    <blip-select position="left" :on-selected="teste" :hide-options="false" :document="{'scope': 'immediate','text':'!@#º😞\nEscolha uma opção','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}" date="08:32 PM"/>

    <blip-select position="right" :on-selected="teste" :hide-options="false" :document="{'text':'!@#º😞\nEscolha uma opção','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}" date="08:32 PM"/>
    <blip-select position="left" :on-selected="teste" :hide-options="false" :document="{'text':'!@#º😞\nEscolha uma opção','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}" date="08:32 PM"/>

    <plain-text position="right" :document="'Oi'" date="08:32 PM"/>
    <plain-text position="left" :document="'Oi'"  date="08:32 PM"/>

    <plain-text position="right" :document="''"  date="08:32 PM"/>
    <plain-text position="left" :document="''"  date="08:32 PM"/>

    <plain-text position="left" :document="'Estou ótimo! http://google.com \n !@#º😞'"  date="08:32 PM"/>
    <plain-text position="right" :document="'Estou ótimo! http://google.com \n !@#º😞'"  date="08:32 PM"/>

    <plain-text :length="100" position="left" date="08:32 PM" :document="'Lorem Ipsum é \n simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum,'"/>
    <plain-text :length="100" position="right" date="08:32 PM" :document="'Lorem Ipsum é \n simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum,'"/>

    <media-link position="right" date="08:33 PM" :document="{type:'audio/mp3',uri:'http://blaamandagjazzband.dk/jazz/mp3/basin_street_blues.mp3',size:3124123}"></media-link>
    <media-link position="left" date="08:33 PM" :document="{type:'audio/mp3',uri:'http://blaamandagjazzband.dk/jazz/mp3/basin_street_blues.mp3',size:3124123}"></media-link>

    <media-link position="right" date="08:33 PM" :document="{'title':'Gato','text':'Segue uma imagem de um gato','type':'image/jpeg','uri':'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg','aspectRatio':'1:1','size':227791,'previewUri':'https://upload.wikimedia.org/wikipedia/commons/f/ff/Vertical_velocity.jpg','previewType':'image/jpeg'}"></media-link>
    <media-link position="left" date="08:33 PM" :document="{'title':'Gato','text':'Segue uma imagem de um gato','type':'image/jpeg','uri':'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg','aspectRatio':'1:1','size':227791,'previewUri':'http://lh6.googleusercontent.com/-S4JRFil2Mio/AAAAAAAAAAI/AAAAAAAAAZM/SoDL3SPaN-E/photo.jpg','previewType':'image/jpeg'}"></media-link>

    <media-link position="right" date="08:33 PM" :document="{type:'video/mp4',uri:'http://www.onirikal.com/videos/mp4/nestlegold.mp4',size:1}"></media-link>

    <div style="clear: both"></div>
>>>>>>> b3c2fc1bf70ba4cd56e790ec18d9286e9a9b2e54
  </div>
</template>

<script>

export default {
  methods: {
    send: function () {
      this.documents.push({ document: JSON.parse(this.json), date: this.date, position: this.position })
    }
  },
  data: function () {
    return {
      documents: [],
      json: JSON.stringify({'id': '1', 'to': '128271320123982@messenger.gw.msging.net', 'type': 'text/plain', 'content': 'Seja bem-vindo ao nosso serviço! Como podemos te ajudar?'}),
      width: 1000,
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
   .float {
     float: left;
     padding: 20px;
   }
</style>
