<template>
  <div class="file-wrapper" @click="(editable ? null : handleFileLink())" :class="editable ? '' : ' pointer'">
    <div class="file-icon-wrapper">
      <img class="file-icon" :src="mimeType | fileIconFilter"/>
    </div>
    <div class="description-wrapper">
      <div class="link-description">
        <bds-typo
          v-if="repliedDocumentTitle"
          tag="span"
          bold="regular"
          variant="fs-16"
          class="text"
          :title="repliedDocumentTitle"
        >{{ sanitize(repliedDocumentTitle) | limitContentFilter(60) }}</bds-typo>
        <bds-typo
          v-else
          tag="span"
          bold="regular"
          variant="fs-16"
          class="text"
          can-grow
          :title="repliedDocumentUri"
        >{{ sanitize(repliedDocumentUri) | limitContentFilter(60) }}</bds-typo>
      </div>
      <bds-typo
        v-if="repliedDocumentSize"
        tag="span"
        bold="regular"
        variant="fs-12"
        class="text small-text"
      >{{ sanitize(repliedDocumentSize) | sizeInBytesFilter }}</bds-typo>
    </div>
  </div>
</template>

<script>
  import mime from 'mime-types'

  export default {
    name: 'replied-with-document',
    mixins: [],
    props: {
      document: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      repliedDocumentUri() {
        return this.document.uri
      },
      repliedDocumentTitle() {
        return this.document.title
      },
      repliedDocumentSize() {
        return this.document.size
      },
      mimeType: function() {
        let extension = mime.extension(this.document.type)
        if (extension) {
          return this.document.type
        }
        return mime.lookup(this.document.uri)
      }
    },
    methods: {
      handleFileLink: function () {
        if (this.onMediaSelected) {
          this.onMediaSelected(this.document.uri)
        } else {
          window.open(this.document.uri, '_blank', 'noopener')
        }
      }
    }
  }
</script>

<style lang="scss">
@import '../../../styles/variables.scss';

.file-wrapper {
  padding: 0;
  height: 80px;
  text-decoration: inherit;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  background: $color-surface-3;

  .file-icon-wrapper {
    display: flex;
    padding: 20px;
    background: $color-surface-2;

    .file-icon {
      display: flex;
      flex-direction: horizontal;
      flex-grow: 1;
      max-height: 40px;
      max-width: 40px;
      object-fit: contain;
    }
  }

  .description-wrapper {
    overflow: hidden;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 206px;
    width: 100%;

    .link-description {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      .text {
        white-space: nowrap;
      }
    }

    .small-text {
      font-size: 10px;
      font-weight: 100;
      display: flex;
    }
  }
}
</style>
  