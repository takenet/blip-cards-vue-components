<template>
  <div style="width: 300px; margin: 0 auto; background-color: #FAF9F8; padding: 20px;">
    <blip-select position="right" :document="{'content':{'text':'Escolha uma opção','options':[{'text':'Primeira opção'},{'order':2,'text':'Segunda opção'},{'order':3,'text':'Terceira opção','type':'application/json','value':{'key1':'value1','key2':2}}]}}" date="08:32 PM"/>

    <plain-text position="right" :document="{content: 'Oi'}" date="08:32 PM"/>
    <plain-text position="left" :document="{content: 'Oi'}"  date="08:32 PM"/>

    <plain-text position="right" :document="{content: ''}"  date="08:32 PM"/>
    <plain-text position="left" :document="{content: ''}"  date="08:32 PM"/>

    <plain-text position="left" :document="{content: 'Estou ótimo! http://google.com \n !@#º😞'}"  date="08:32 PM"/>
    <plain-text position="right" :document="{content: 'Estou ótimo! http://google.com \n !@#º😞'}"  date="08:32 PM"/>

    <plain-text :length="100" position="left" date="08:32 PM" :document="{content: 'Lorem Ipsum é \n simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum,'}"/>
    <plain-text :length="100" position="right" date="08:32 PM" :document="{content: 'Lorem Ipsum é \n simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum,'}"/>

    <div style="clear: both"></div>
  </div>
</template>

<script>

export default {
  components: {
  }
}
</script>
