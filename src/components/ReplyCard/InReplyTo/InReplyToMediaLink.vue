<template>
  <div>
    <div>Media link</div>
    <div>{{inReplyTo.type}}</div>
    <blip-image
        :image-uri-msg="titleMsg"
        :title-msg="titleMsg"
        :text-msg="textMsg"
        :aspect-ratio-msg="aspectRatioMsg"
        :supported-formats-msg="supportedFormatsMsg"
        :document="inReplyTo"
        :full-document="inReplyTo"
        :date="date"
        v-if="inReplyTo.type.indexOf('image') != -1"
        :editable="editable"
        :on-media-selected="onMediaSelected"
        :on-save="save"
        :on-deleted="onDeleted"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :on-cancel="onCancel"
        :editing="editing"
        :async-fetch-media="asyncFetchMedia"
      />
      <blip-audio
        :file-url-msg="fileUrlMsg"
        :document="inReplyTo"
        :full-document="inReplyTo"
        :date="date"
        v-else-if="inReplyTo.type.indexOf('audio') != -1"
        :editable="editable"
        :on-save="save"
        :on-deleted="onDeleted"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :on-cancel="onCancel"
        :editing="editing"
        :on-audio-validate-uri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"
      />
      <blip-video
        :video-uri-msg="videoUriMsg"
        :document="inReplyTo"
        :full-document="inReplyTo"
        :date="date"
        @updated="emitUpdate"
        v-else-if="inReplyTo.type.indexOf('video') != -1"
        :editable="editable"
        :on-save="save"
        :on-deleted="onDeleted"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :on-cancel="onCancel"
        :editing="editing"
        :async-fetch-media="asyncFetchMedia"
      />
      <blip-file
        :title-msg="titleMsg"
        :document="inReplyTo"
        :full-document="inReplyTo"
        :position="position"
        :date="date"
        v-else
        :editable="editable"
        :on-media-selected="onMediaSelected"
        :on-save="save"
        :on-deleted="onDeleted"
        :on-metadata-edit="isMetadataReady"
        :deletable="deletable"
        :on-cancel="onCancel"
        :editing="editing"
        :async-fetch-media="asyncFetchMedia"
      />
    </div>
</template>

<script>
  export default {
    name: 'in-reply-to-media-link',
    mixins: [],
    props: {
      inReplyTo: {
        type: Object,
        default: {}
      },
      asyncFetchMedia: {
        type: Function
      },
      onMediaSelected: {
        type: Function
      },
      translations: {
        type: Object,
        default: () => ({})
      },
      failedToSendMsg: {
        type: String,
        default: 'Falha ao enviar a mensagem'
      },
      aspectRatioMsg: String,
      supportedFormatsMsg: String,
      fileUrlMsg: String,
      imageUriMsg: String,
      videoUriMsg: String,
      titleMsg: String,
      textMsg: String,
      onAudioValidateUri: {
        type: Function
      },
      position: {
        type: String,
        default: 'left'
      }
    },
    computed: {
      isApplicationJsonType() {
        return this.inReplyTo.type === 'application/json'
      },
      interactiveHeader() {
        return this.inReplyTo.value.interactive.header
      },
      interactiveHeaderText() {
        return this.inReplyTo.value.interactive.header.text
      },
      interactiveBodyText() {
        return this.inReplyTo.value.interactive.body.text
      },
      inReplyToText() {
        switch (this.inReplyTo.type) {
          case 'text/plain':
            return this.inReplyTo.value
          case 'application/vnd.lime.select+json':
            return this.inReplyTo.value.text
          case 'application/json':
            return this.interactiveHeader ? this.interactiveHeaderText : this.interactiveBodyText
          default:
            return ''
        }
      },
      inReplyToDescription() {
        return this.isApplicationJsonType && this.interactiveHeader ? this.interactiveBodyText : ''
      },
      hasDescription() {
        return Boolean(this.inReplyToDescription)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/variables.scss';

  .message-inReplyTo-text {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    margin: 0;
    text-align: left;

    &.single {
      -webkit-line-clamp: 3;
    }

    &.title {
      -webkit-line-clamp: 1;
    }

    &.description {
      -webkit-line-clamp: 2;
    }
  }
</style>
