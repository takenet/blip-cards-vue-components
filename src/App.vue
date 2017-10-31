<template>
  <div style="width: 250px">
    <plain-text :length="10" pos="right" :documents="[{content: 'Oi'}]"/>
    <plain-text pos="left" :documents="[{content: 'Estou ótimo! Ao contrário do que se  acredita, Lorem Ipsum não é simplesmente um texto randômico. Com mais de 2000 anos, suas raízes.'}]"/>
  </div>
</template>

<script>

export default {
  components: {
  }
}
</script>