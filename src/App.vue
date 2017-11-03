<template>
  <div style="width: 300px; margin: 0 auto; background-color: #FAF9F8; padding: 20px;">
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

    <div style="clear: both"></div>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      teste: function (obj) {
        console.log(obj)
      }
    }
  },
  components: {
  }
}
</script>


