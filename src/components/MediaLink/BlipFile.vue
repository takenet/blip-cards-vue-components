<template>
  <div class="application">
    <div :class="'bubble ' + position">
      <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>
      <div v-if="!isEditing" :class="`file-${position}`">
        <div class="file-wrapper" @click="(editable ? null : handleFileLink())" :class="editable ? '' : ' pointer'">
          <div class="file-icon-wrapper">
            <img class="file-icon" :src="mimeType | fileIconFilter"/>
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
          <button type="button" class="btn saveIco closeIco" @click="cancel()" >
            <img :src="closeSvg" />
          </button>
          <button type="submit" class="btn saveIco" @click="fileSave()" :class="{'is-disabled': errors.any() }">
            <img :src="approveSvg" />
          </button>
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
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'
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
    }
  },
  data: function() {
    return {
      title: undefined,
      uri: undefined,
      type: undefined,
      size: undefined
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
      this.size = this.document.siz
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
@import '../../styles/variables.scss';

.media-link .application {
  .bubble {
    &.left, &.middle {
      .description-wrapper {
        color: $vue-gray;
      }
    }

    &.right {
      .file-icon-wrapper {
        background-color: $vue-white;
        padding-right: 20px !important;
      }
      .description-wrapper {
        color: $vue-white;
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
        color: $vue-dark-gray;
        display: block;
      }

      margin: 0;
      padding: 10px 20px;
    }
  }

  .file-left{
    border-radius: 8px;
    background-color: #f2f7fa;
    margin: 5px 5px;
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
