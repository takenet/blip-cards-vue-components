<template>
  <div :class="'blip-container media-link ' + mediaComponent.type.split('/')[0] + isFailedMessage(status, position)"
    id="blip-container">
    <div id='media-content'>
      <blip-image
        :image-uri-msg="titleMsg"
        :title-msg="titleMsg"
        :text-msg="textMsg"
        :aspect-ratio-msg="aspectRatioMsg"
        :supported-formats-msg="supportedFormatsMsg"
        :document="componentImage"
        :full-document="fullDocument"
        :position="position"
        :date="date"
        v-if="componentImage !== undefined"
        :useBorderRadius="false"/>

      <blip-audio
        :class="'padding-control'"
        :file-url-msg="fileUrlMsg"
        :document="componentAudio"
        :full-document="fullDocument"
        :position="position"
        :date="date"
        v-else-if="componentAudio !== undefined"
        :on-audio-validate-uri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"/>

      <blip-video
        :video-uri-msg="videoUriMsg"
        :document="componentVideo"
        :full-document="fullDocument"
        :position="position"
        :date="date"
        v-else-if="componentVideo !== undefined"
        :on-metadata-edit="isMetadataReady"
        :on-video-validate-uri="onAudioValidateUri"
        :async-fetch-media="asyncFetchMedia"/>--->

      <div :class="'file-container' + ' ' + position" v-if="componentDocument !== undefined">
        <div  class="file-wrapper" @click="handleFileLink()">
          <div class="file-icon-wrapper">
            <img v-if="isLoading" :src="loadingGif" alt />
            <img v-else class="file-icon" :src="mimeType | fileIconFilter"/>
          </div>
          <div class="description-wrapper">
            <div class="link-description">
              <span v-if="document.title" :title="document.title" class="text">{{ document.title }}</span>
              <span v-else :title="document.uri" class="text">{{ document.uri }}</span>
            </div>
            <span v-if="document.size" class="text small-text">{{ document.size | sizeInBytesFilter }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>

import BlipImage from '../MediaLink/Image'
import BlipAudio from '../MediaLink/Audio'
import BlipVideo from '../MediaLink/Video'
import BlipFile from '../MediaLink/BlipFile'
import { default as base } from '../../mixins/baseComponent.js'
import { parseComponentImage, parseComponentAudio, parseComponentVideo, parseComponentDocument } from '@/utils/TemplateContent'
import { isFailedMessage } from '../../utils/misc'
import mime from 'mime-types'
import { isAuthenticatedMediaLink, tryCreateLocalMediaUri } from '../../utils/media.js'

export default {
  name: 'media-content',
  props: {
    status: {
      type: String,
      default: ''
    },
    aspectRatioMsg: String,
    supportedFormatsMsg: String,
    fileUrlMsg: String,
    imageUriMsg: String,
    videoUriMsg: String,
    titleMsg: String,
    textMsg: String,
    document: {},
    onAudioValidateUri: {
      type: Function
    },
    onMediaSelected: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    }
  },
  computed: {
    mediaComponent() {
      return this.componentImage || this.componentAudio || this.componentDocument || this.componentVideo
    }
  },
  data: function() {
    return {
      isFailedMessage,
      componentImage: {},
      componentVideo: {},
      componentDocument: {},
      componentAudio: {},
      isLoading: false
    }
  },
  mixins: [
    base
  ],
  created() {
    this.componentImage = parseComponentImage(this.document)
    this.componentAudio = parseComponentAudio(this.document)
    this.componentDocument = parseComponentDocument(this.document)
    this.componentVideo = parseComponentVideo(this.document)
    console.log('this.documen', this.document)
    console.log('componentDocument', this.componentDocument)
    console.log('componentAudio', this.componentAudio)
  },
  components: {
    BlipImage,
    BlipAudio,
    BlipVideo,
    BlipFile
  },
  computed: {
    mimeType: function() {
      let extension = mime.extension(this.componentDocument.type)
      if (extension) {
        return this.componentDocument.type
      }
      return mime.lookup(this.componentDocument.uri)
    }
  },
  methods: {
    handleFileLink: async function () {
      const uri = await this.getFileUri()

      this.isLoading = true
      await this.openFileInNewTab(uri)
      this.isLoading = false
    },
    openFileInNewTab: function(uri) {
      window.open(uri, '_blank', 'noopener')
      this.asyncFetchMedia && URL.revokeObjectURL(uri)
    },
    getFileUri: async function () {
      return isAuthenticatedMediaLink(this.componentDocument)
        ? tryCreateLocalMediaUri(this.componentDocument, this.asyncFetchMedia)
        : this.componentDocument.uri
    }
  }
}
</script>
<style lang="scss">
@import '../../styles/variables.scss';

// .bubble {
//   &.right {
//     margin-right: 0px;
//   }

//   &.left {
//     margin-left: 0px;
//   }
// }

.padding-control {
 padding: $bubble-padding !important;
}

.left,
  .middle {
    .slider {
      background-color: $color-surface-3;
    }
    .progress .pin {
      background-color: $color-content-default;
    }
    .audio-player-button {
      fill: $color-content-default;
    }
    .blip-change-playback-rate {
      border-color: $color-content-ghost;
      color: $color-content-default;
    }
    .video-player-time {
      color: $color-content-default;
    }
  }
  .right {
    .slider {
      background-color: $color-content-ghost;
    }
    .progress .pin {
      background-color: $color-surface-1;
    }
    .audio-player-button {
      fill: $color-surface-1;
    }

    .video-player-time {
      color: $color-surface-1;
    }

    .blip-change-playback-rate {
      border-color: $color-content-ghost;
      color: $color-surface-1;
    }
  }
.media-link {
  .file-container {
    &.left, &.middle {
      .description-wrapper {
        color: $color-content-default;
      }
    }

    &.right {
      .file-icon-wrapper {
        background-color: $color-surface-3;
        padding-right: 20px !important;
      }
      .description-wrapper {
        padding-left: 20px !important;
      }
    }

    .file-wrapper {
      padding: 0;
      height: 80px;
      text-decoration: inherit;
      display: flex;
      flex-direction: row;
      align-content: center;
      justify-content: flex-start;

      .file-icon-wrapper {
        display: flex;
        padding: 20px;
        padding-right: 10px;

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
        padding-left: 10px;
        display: flex;
        flex-direction: column;

        .link-description {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          .text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .small-text {
          font-size: 10px;
          font-weight: 100;
          display: flex;
          align-items: flex-start;
        }
      }
    }

    .file-text {
      text-align: left;
      strong {
        color: $color-content-default;
        display: block;
      }

      margin: 0;
      padding: 10px 20px;
    }
  }
}

</style>
