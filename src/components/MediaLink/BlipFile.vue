<template>
  <div class="application">
    <div :class="'bubble ' + position">
      <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>
      <div v-if="!isEditing">
        <a :href="document.uri" target="_blank" class="file-wrapper">
          <div class="file-icon-wrapper">
            <img class="file-icon" :src="mimeType | fileIconFilter"/>
          </div>
          <div class="description-wrapper">
            <div class="link-description">
              <span v-if="document.title" :title="document.title" class="text big-text">{{ document.title }}</span>
              <span v-else :title="document.uri" class="text big-text">{{ document.uri }}</span>
            </div>
            <span v-if="document.size" class="text small-text">{{ document.size | sizeInBytesFilter }}</span>
          </div>
        </a>
      </div>
      <div v-else>
        <form novalidate v-on:submit.prevent>
          <div class="btn saveIco closeIco" @click="cancel()" >
            <img :src="closeSvg" />
          </div>
          <div class="btn saveIco" @click="fileSave()" :class="{'is-disabled': errors.any() }">
            <img :src="approveSvg" />
          </div>
          <div class="form-group">
            <input type="text" name="file" class="form-control uri" v-model="uri" placeholder="File URL" :class="{'input-error': errors.has('file') }" v-validate="'required|url'"/>
            <span v-if="errors.has('file')" class="help input-error">{{ errors.first('file') }}</span>
            <input type="text" class="form-control title" v-model="title" placeholder="Title"/>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'
import mime from 'mime-types'

export default {
  mixins: [base],
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
    }
  }
}
</script>


<style lang="scss">
@import '../../styles/variables.scss';

.media-link .application {
  .bubble {
    &.left {
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
      justify-content: center;

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
}
</style>
