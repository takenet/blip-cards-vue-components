<template>
  <div>
    <bds-button-icon v-if="deletable && !isEditing"
      class="editIco trashIco icon-button-margin"
      icon="trash"
      variant="delete"
      size="short"
      v-on:click="trash(document)"
    ></bds-button-icon>
    <bds-button-icon v-if="editable && !isEditing"
      class="editIco icon-button-margin"
      icon="edit"
      variant="primary"
      size="short"
      v-on:click="toggleEdit"
    ></bds-button-icon>
    <div v-if="!isEditing" :class="`file-${position}`">
      <div v-if="simplified">
        <bds-grid align-items="center" gap="1">
          <bds-icon class="typo" size="small" name="file-empty-file" theme="outline"></bds-icon>
          <bds-typo v-if="document.title" class="typo" tag="span">{{ document.title }}</bds-typo>
          <bds-loading-spinner v-if="isLoading" size="extra-small" color="light"></bds-loading-spinner>
          <img height="56px" width="56px" v-if="!isLoading" :src="mimeType | fileIconFilter"/>
        </bds-grid>
      </div>
      <div v-if="!simplified" class="file-wrapper" @click="(editable || isLoading ? null : handleFileLink())" :class="editable ? '' : ' pointer'">
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
    <div v-else>
      <form novalidate v-on:submit.prevent>
        <bds-button-icon
          class="btn saveIco closeIco"
          icon="close"
          variant="ghost"
          size="short"
          v-on:click="cancel()"
        ></bds-button-icon>
        <bds-button-icon
          class="btn saveIco"
          icon="check"
          variant="primary"
          size="short"
          :disabled="errors.any()"
          v-on:click="fileSave()"
        ></bds-button-icon>
        <div class="form-group">
          <input type="text" name="file" class="form-control uri" v-model="uri" :placeholder="fileUrlMsg" :class="{'input-error': errors.has('file') }" v-validate="'required|url'"/>
          <span v-if="errors.has('file')" class="help input-error">{{ errors.first('file') }}</span>
          <input type="text" class="form-control title" v-model="title" :placeholder="titleMsg"/>
        </div>
        <button v-if="typeof onMetadataEdit === 'function'" class="define-metadata blip-media-link-metadata" @click="editMetadata(fullDocument)">
          {{ metadataButtonText }}
        </button>
      </form>
    </div>
    <div class="file-text" v-if="document.text">
      <span v-if="document.text" v-html="sanitize(document.text)"></span>
    </div>
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'
import { isAuthenticatedMediaLink, tryCreateLocalMediaUri } from '../../utils/media.js'
import mime from 'mime-types'

export default {
  mixins: [base],
  props: {
    fileUrlMsg: {
      type: String,
      default: 'File URL'
    },
    titleMsg: {
      type: String,
      default: 'Title'
    },
    onMediaSelected: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    },
    simplified: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      title: undefined,
      uri: undefined,
      type: undefined,
      size: undefined,
      isLoading: false
    }
  },
  computed: {
    mimeType: function() {
      let extension = mime.extension(this.document.type)
      if (extension) {
        return this.document.type
      }
      return mime.lookup(this.document.uri)
    }
  },
  methods: {
    init: function() {
      this.title = this.document.title
      this.uri = this.document.uri
      this.type = this.document.type
        ? this.document.type
        : mime.lookup(this.uri)
      this.size = this.document.size
    },
    fileSave: async function() {
      let result = await this.$validator.validateAll()
      if (!result) return

      this.save({
        ...this.document,
        title: this.title,
        uri: this.uri,
        type: mime.lookup(this.uri) ? mime.lookup(this.uri) : 'application/pdf'
      })
    },
    getFileUri: async function () {
      return isAuthenticatedMediaLink(this.document)
        ? tryCreateLocalMediaUri(this.document, this.asyncFetchMedia)
        : this.document.uri
    },
    handleFileLink: async function () {
      const uri = await this.getFileUri()

      if (this.onMediaSelected) {
        this.onMediaSelected(uri)
      } else {
        this.isLoading = true
        await this.openFileInNewTab(uri)
        this.isLoading = false
      }
    },
    openFileInNewTab: function(uri) {
      window.open(uri, '_blank', 'noopener')
      this.asyncFetchMedia && URL.revokeObjectURL(uri)
    }
  }
}
</script>


<style lang="scss">
@import '../../styles/variables.scss';

.media-link {
  .bubble {
    &.left, &.middle {
      .description-wrapper {
        color: $color-content-default;
      }
    }

    &.right {
      .file-icon-wrapper {
        background-color: $color-surface-3;
        padding-right: 20px !important;
        border-radius: 13px 0 0 13px;
      }
      .description-wrapper {
        padding-left: 20px !important;
        border-radius: 0 2px 2px 0;
      }
    }


    &.left {
      .file-icon-wrapper {
        background-color: $color-surface-2;
        padding-right: 20px !important;
        border-radius: 13px 0 0 2px;
      }
      .description-wrapper {
        background-color: $color-surface-1;
        color: $color-content-default;
        padding-left: 20px !important;
        border-radius: 0 13px 13px 0;
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

  .replied{
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
          max-width: 100%;
          .text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: $color-content-default;
          }
        }

        .small-text {
          font-size: 10px;
          font-weight: 100;
          display: flex;
          color: $color-content-default;
        }
      }
    }
  }

  .form-group {
    min-width: auto;
    .form-control.title {
      margin-top: 10px;
    }
  }

  .blip-media-link-metadata {
    margin-top: -20px;
    padding: 0 10px 10px 0;
  }
}

</style>
