<template>
  <div style="width: 300px; margin: 0 auto; background-color: #FAF9F8; padding: 20px;">
    <plain-text position="right" :document="{content: 'Oi'}"/>
    <plain-text position="left" :document="{content: 'Oi'}"/>
    
    <plain-text position="right" :document="{content: ''}"/>
    <plain-text position="left" :document="{content: ''}"/>
    
    <plain-text position="left" :document="{content: 'Estou ótimo! http://google.com \n !@#º😞'}"/>
    <plain-text position="right" :document="{content: 'Estou ótimo! http://google.com \n !@#º😞'}"/>

    <plain-text :length="100" position="left" :document="{content: 'Lorem Ipsum é \n simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum,'}"/>
    <plain-text :length="100" position="right" :document="{content: 'Lorem Ipsum é \n simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum,'}"/>

    <div style="clear: both"></div>
  </div>
</template>

<script>

export default {
  components: {
  }
}
</script>