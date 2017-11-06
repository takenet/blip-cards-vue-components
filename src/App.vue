<template>
  <div style="width: 1000px; margin: 0 auto; background-color: #FAF9F8; padding: 20px;">

    <document-select position="left" :on-selected="teste" :document="{'content':{'header':{'type':'application/vnd.lime.media-link+json','value':{'title':'Seja bem-vindo ao Chapeleiro Maluco','text':'Aqui temos o melhor chapéu para sua cabeça.','type':'image/jpeg','uri':'https://upload.wikimedia.org/wikipedia/commons/f/ff/Vertical_velocity.jpg','aspectRatio':'2:1'}},'options':[{'label':{'type':'application/vnd.lime.web-link+json','value':{'text':'Visitar site','uri':'https://petersapparel.parseapp.com/view_item?item_id=100'}}},{'label':{'type':'text/plain','value':'Ver estoque'},'value':{'type':'application/json','value':{'action':'show-items'}}}]}}" date="08:32 PM"/>
    <document-select position="left" :on-selected="teste" :document="{'content':{'header':{'type':'application/vnd.lime.media-link+json','value':{'title':'Seja bem-vindo ao Chapeleiro Maluco','type':'image/jpeg','uri':'http://blog.inpulse.vet.br/wp-content/uploads/2016/10/como-evitar-arranhoes-do-seu-gato.jpg','aspectRatio':'1:1'}},'options':[{'label':{'type':'application/vnd.lime.web-link+json','value':{'text':'Visitar site','uri':'https://petersapparel.parseapp.com/view_item?item_id=100'}}},{'label':{'type':'text/plain','value':'Ver estoque'},'value':{'type':'application/json','value':{'action':'show-items'}}}]}}" date="08:32 PM"/>
    <document-select position="left" :on-selected="teste" :document="{'content':{'header':{'type':'application/vnd.lime.media-link+json','value':{'text':'Aqui temos o melhor chapéu para sua cabeça.','type':'image/jpeg','uri':'http://blog.inpulse.vet.br/wp-content/uploads/2016/10/como-evitar-arranhoes-do-seu-gato.jpg','aspectRatio':'1:1'}},'options':[{'label':{'type':'application/vnd.lime.web-link+json','value':{'text':'Visitar site','uri':'https://petersapparel.parseapp.com/view_item?item_id=100'}}},{'label':{'type':'text/plain','value':'Ver estoque'},'value':{'type':'application/json','value':{'action':'show-items'}}}]}}" date="08:32 PM"/>
    <document-select position="left" :on-selected="teste" :document="{'content':{'header':{'type':'application/vnd.lime.media-link+json','value':{'type':'image/jpeg','uri':'http://blog.inpulse.vet.br/wp-content/uploads/2016/10/como-evitar-arranhoes-do-seu-gato.jpg','aspectRatio':'1:1'}},'options':[{'label':{'type':'application/vnd.lime.web-link+json','value':{'text':'Visitar site','uri':'https://petersapparel.parseapp.com/view_item?item_id=100'}}},{'label':{'type':'text/plain','value':'Ver estoque'},'value':{'type':'application/json','value':{'action':'show-items'}}}]}}" date="08:32 PM"/>

    <blip-select position="right" :on-selected="teste" :hide-options="true" :document="{'content':{'scope': 'immediate','text':'Sem opcoes','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}}" date="08:32 PM"/>
    <blip-select position="left" :on-selected="teste" :hide-options="true" :document="{'content':{'scope': 'immediate','text':'Sem opcoes','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}}" date="08:32 PM"/>

    <blip-select position="right" :on-selected="teste" :hide-options="false" :document="{'content':{'scope': 'immediate','text':'!@#º😞\nEscolha uma opção','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}}" date="08:32 PM"/>
    <blip-select position="left" :on-selected="teste" :hide-options="false" :document="{'content':{'scope': 'immediate','text':'!@#º😞\nEscolha uma opção','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}}" date="08:32 PM"/>

    <blip-select position="right" :on-selected="teste" :hide-options="false" :document="{'content':{'text':'!@#º😞\nEscolha uma opção','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}}" date="08:32 PM"/>
    <blip-select position="left" :on-selected="teste" :hide-options="false" :document="{'content':{'text':'!@#º😞\nEscolha uma opção','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}}" date="08:32 PM"/>

    <plain-text position="right" :document="{content: 'Oi'}" date="08:32 PM"/>
    <plain-text position="left" :document="{content: 'Oi'}"  date="08:32 PM"/>

    <plain-text position="right" :document="{content: ''}"  date="08:32 PM"/>
    <plain-text position="left" :document="{content: ''}"  date="08:32 PM"/>

    <plain-text position="left" :document="{content: 'Estou ótimo! http://google.com \n !@#º😞'}"  date="08:32 PM"/>
    <plain-text position="right" :document="{content: 'Estou ótimo! http://google.com \n !@#º😞'}"  date="08:32 PM"/>

    <plain-text :length="100" position="left" date="08:32 PM" :document="{content: 'Lorem Ipsum é \n simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum,'}"/>
    <plain-text :length="100" position="right" date="08:32 PM" :document="{content: 'Lorem Ipsum é \n simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum,'}"/>

    <media-link position="right" date="08:33 PM" :document="{content:{type:'audio/mp3',uri:'http://blaamandagjazzband.dk/jazz/mp3/basin_street_blues.mp3',size:3124123}}"></media-link>
    <media-link position="left" date="08:33 PM" :document="{content:{type:'audio/mp3',uri:'http://blaamandagjazzband.dk/jazz/mp3/basin_street_blues.mp3',size:3124123}}"></media-link>

    <media-link position="right" date="08:33 PM" :document="{'content':{'title':'Gato','text':'Segue uma imagem de um gato','type':'image/jpeg','uri':'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg','aspectRatio':'1:1','size':227791,'previewUri':'https://upload.wikimedia.org/wikipedia/commons/f/ff/Vertical_velocity.jpg','previewType':'image/jpeg'}}"></media-link>
    <media-link position="left" date="08:33 PM" :document="{'content':{'title':'Gato','text':'Segue uma imagem de um gato','type':'image/jpeg','uri':'http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg','aspectRatio':'1:1','size':227791,'previewUri':'http://lh6.googleusercontent.com/-S4JRFil2Mio/AAAAAAAAAAI/AAAAAAAAAZM/SoDL3SPaN-E/photo.jpg','previewType':'image/jpeg'}}"></media-link>


    <div style="clear: both"></div>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      teste: function (text, obj) {
        console.log(text, obj)
      }
    }
  },
  components: {
  }
}
</script>

