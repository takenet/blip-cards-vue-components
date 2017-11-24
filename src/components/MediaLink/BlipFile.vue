<template>
  <div>
    <div :class="'bubble ' + position">
      <div v-if="editable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>
      <div v-if="!isEditing">
        <a :href="document.uri" target="_blank" class="file-wrapper">
          <div class="file-icon-wrapper">
            <img class="file-icon" :src="document.type | fileIconFilter"/>
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
          <div class="saveIco closeIco" @click="fileCancel()" >
            <img :src="closeSvg" />
          </div>
          <div class="saveIco" @click="fileSave()" :class="{'is-disabled': errors.any() }">
            <img :src="approveSvg" />
          </div>
          <div class="form-group">
            <input type="text" name="file" class="form-control uri" v-model="uri" placeholder="File URL" :class="{'input-error': errors.has('file') }" v-validate="'required|url'"/>
            <span v-if="errors.has('file')" class="help input-error">{{ errors.first('file') }}</span>
            <input type="text" class="form-control tittle" v-model="title" placeholder="Title"/>
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
  mixins: [
    base
  ],
  data: function () {
    return {
      title: this.document.title,
      uri: this.document.uri,
      type: this.document.type,
      size: this.document.size
    }
  },
  methods: {
    fileSave: async function () {
      let result = await this.$validator.validateAll()
      if (!result) return

      this.save({
        ...this.document,
        title: this.title,
        uri: this.uri,
        type: mime.lookup(this.uri)
      })
    },
    fileCancel: function () {
      this.isEditing = false
      this.title = this.document.title
      this.uri = this.document.uri
    }
  }
}
</script>


<style lang="scss">
   @import '../../styles/variables.scss';

  .media-link.application {
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
      .form-control.tittle {
        margin-top: 10px;
      }
    }
  }
</style>
