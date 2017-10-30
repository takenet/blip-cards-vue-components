<template>
  <div style="width: 250px">
    <PlainText :length="10" pos="right" :documents="[{content: 'Oi'}]"/>
    <PlainText pos="left" :documents="[{content: 'Estou ótimo! Ao contrário do que se  acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes.'}]"/>
  </div>
</template>

<script>
import PlainText from './components/PlainText'

export default {
  components: {
    PlainText
  }
}
</script>