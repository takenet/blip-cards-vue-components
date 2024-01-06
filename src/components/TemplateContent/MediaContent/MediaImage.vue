<template>
  <div v-if="componentImage !== undefined"
    class="pointer" @click="openImageLink()">
    <img :src="componentImage.uri" class="media-image"/>
  </div>  
</template>

<script>

export default {
  name: 'media-image',
  props: {
    componentImage: {}
  },
  methods: {
    openImageLink: function() {
      window.open(this.componentImage.uri, '_blank', 'noopener')
    }
  }
}
</script>

<style lang="scss">
@import '../../../styles/variables.scss';

.media-image {
  width: 100%;
  min-height: 207px;
  max-height: 460px;
  object-fit: none;
}
</style>
