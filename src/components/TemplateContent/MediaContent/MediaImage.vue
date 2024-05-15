<template>
  <div v-if="componentImage && componentImage.uri"
    class="pointer" @click="openImageLink()">
    <img :src="componentImage.uri" class="media-image"/>
  </div>
  <div v-else
    class="default-image-div">
    <div class="default-image">
      <bds-icon name="file-image" color="var(--$color-content-ghost, #8C8C8C)" />
    </div>
    <bds-typo class="typo" tag="p" variant="fs-12" bold="regular">
      {{ emptyMediaMessage }}
    </bds-typo>
  </div>
</template>

<script>

export default {
  name: 'media-image',
  props: {
    componentImage: {},
    asyncFetchMedia: {
      type: Function
    },
    emptyMediaMessage: {
      type: String,
      default: 'Insira um imagem em “Mídia“'
    }
  },
  methods: {
    openImageLink: function() {
      window.open(this.componentImage.uri, '_blank', 'noopener')
    }
  },
  destroyed: function() {
    this.componentImage && this.asyncFetchMedia && URL.revokeObjectURL(this.componentImage.uri)
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

.default-image-div {
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $color-surface-2;
  flex-direction: column;
}

.default-image {
  margin-bottom: 8px;
}
</style>
