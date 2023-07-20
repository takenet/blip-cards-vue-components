<template>
  <div class="blip-container interactive-button">
    <div :class="'bubble ' + position">
      <div class="interactive-button-container">
        <div v-if="header" class="interactive-header">
          <div
            v-if="header.type === 'document'"
            class="interactive-file"
            @click="handleFileLink(header.document.link)"
          >
            <div class="file-icon-wrapper">
              <img class="file-icon" :src="mimeType | fileIconFilter" />
            </div>
            <div class="description-wrapper">
              <div class="link-description">
                <bds-typo
                  v-if="header.document.filename"
                  tag="span"
                  margin="false"
                  variant="fs-16"
                  bold="regular"
                  class="truncate"
                  v-html="sanitize(header.document.filename)"
                ></bds-typo>
                <bds-typo
                  v-else
                  tag="span"
                  margin="false"
                  variant="fs-16"
                  bold="regular"
                  class=" truncate"
                  v-html="sanitize(header.document.link)"
                ></bds-typo>
              </div>
            </div>
          </div>
          <div
            v-if="header.type === 'image'"
            ref="headerImgContainer"
            class="header-img-container"
            @click="handleFileLink(header.image.link)"
          >
            <div ref="headerImg">
              <img
                :src="header.image.link"
                :alt="header.text"
                class="interactive-header-img"
                @load="fitImage"
                @error="onLoadError"
              />
            </div>
          </div>
          <div v-if="header.type === 'text'" class="interactive-header-text">
            <bds-typo
              v-if="header.text"
              tag="h1"
              margin="false"
              variant="fs-16"
              bold="bold"
              class="typo"
              v-html="sanitize(header.text)"
            ></bds-typo>
          </div>
          <div v-if="header.type === 'video'">
            <video controls width="300" class="interactive-header-video">
              <source :src="header.video.link" />
            </video>
          </div>
        </div>
        <div v-if="body" class="align-text">
          <bds-typo
            v-if="body.text"
            tag="p"
            margin="false"
            variant="fs-16"
            bold="regular"
            class="typo"
            v-html="sanitize(body.text)"
          ></bds-typo>
        </div>
        <div v-if="footer" class="align-text">
          <bds-typo
            v-if="footer.text"
            tag="span"
            margin="false"
            variant="fs-14"
            bold="regular"
            class="typo"
            v-html="sanitize(footer.text)"
          ></bds-typo>
        </div>
        <div>
          <ul class="interactive-btn-list">
            <li v-for="(item, index) in buttons" :key="index">
              <bds-typo
                tag="p"
                margin="true"
                variant="fs-16"
                bold="regular"
                class="color-primary"
                v-html="sanitize(item.reply.title)"
              ></bds-typo>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import mime from 'mime-types'
import BrokenWhite from '../assets/img/BrokenWhite.svg'
import Broken from '../assets/img/Broken.svg'

export default {
  name: 'interactive-button',
  mixins: [base],
  computed: {
    buttons() {
      return this.document.interactive.action.buttons
    },
    body() {
      return this.document.interactive.body
    },
    header() {
      return this.document.interactive.header
    },
    footer() {
      return this.document.interactive.footer
    },
    headerImgElement() {
      return this.$refs.headerImg
    },
    headerImgContainerElement() {
      return this.$refs.headerImgContainer
    },
    mimeType() {
      return mime.lookup(this.header.document.link)
    }
  },
  methods: {
    onLoadError(event) {
      event.target.src = this.position === 'right' ? BrokenWhite : Broken
    },
    fitImage(event) {
      const { naturalWidth, naturalHeight } = event.target
      const aspectRatio = naturalHeight / naturalWidth
      const isPortrait = aspectRatio > 1

      if (isPortrait) {
        this.fitPortraitImage(aspectRatio)
      } else {
        this.fitLandscapeImage(aspectRatio)
      }
    },
    fitPortraitImage(aspectRatio) {
      const IMG_PORTRAIT_WIDTH = 240
      const IMG_PORTRAIT_MAX_HEIGHT = 330
      const newHeight = aspectRatio * IMG_PORTRAIT_WIDTH

      this.headerImgContainerElement.style.width = `${IMG_PORTRAIT_WIDTH}px`
      this.headerImgContainerElement.style.height = `${IMG_PORTRAIT_MAX_HEIGHT}px`
      this.headerImgElement.style.width = `${IMG_PORTRAIT_WIDTH}px`
      this.headerImgElement.style.height = `${newHeight}px`
    },
    fitLandscapeImage(aspectRatio) {
      const IMG_LANDSCAPE_WIDTH = 300
      const newHeight = aspectRatio * IMG_LANDSCAPE_WIDTH

      this.headerImgContainerElement.style.width = `${IMG_LANDSCAPE_WIDTH}px`
      this.headerImgContainerElement.style.height = `${newHeight}px`
      this.headerImgElement.style.width = `${IMG_LANDSCAPE_WIDTH}px`
      this.headerImgElement.style.height = `${newHeight}px`
    },
    handleFileLink(link) {
      window.open(link, '_blank', 'noopener')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

$hard-round: 13px;
.bubble {
  &.left,
  &.midlle {
    .interactive-button-container {
      .interactive-header {
        .interactive-file {
          .file-icon-wrapper {
            background-color: $color-surface-2;
          }
          .description-wrapper {
            background-color: $color-surface-1;
          }
        }
      }
    }
  }
  &.right {
    .interactive-button-container {
      .interactive-header {
        .interactive-file {
          .file-icon-wrapper {
            background-color: $color-surface-3;
          }
          .description-wrapper {
            background-color: $color-surface-2;
          }
        }
      }
    }
  }
}

.interactive-button-container {
  max-width: 316px;
  min-width: 256px;
  border-radius: inherit;
  text-align: left;
}

.interactive-header-text {
  padding: 0 8px;
}

.align-text {
  padding: 4px 16px;
}

.interactive-btn-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: $color-surface-3;
  text-align: center;
  border-bottom-left-radius: $hard-round;

  li {
    padding: 0.5rem;
    &:not(:last-child) {
      border-bottom: 1px solid $color-content-ghost;
    }
  }
}

.color-content-default {
  color: $color-content-default;
}

.color-primary {
  color: $color-primary;
}

.interactive-header {
  padding: 0.5rem;
}

.border-radius {
  border-radius: $hard-round $hard-round 0 0;
}

.interactive-header-img {
  width: 100%;
}

.header-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: $hard-round $hard-round 0 0;
  cursor: pointer;
}

.interactive-header-video {
  border-radius: $hard-round $hard-round 0 0 !important;
}

.interactive-file {
  background-color: $color-surface-1;
  padding: 0;
  height: 80px;
  text-decoration: inherit;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  border-radius: $hard-round $hard-round 0 0;
  cursor: pointer;

  .file-icon-wrapper {
    display: flex;
    padding: 20px;
    padding-right: 10px;
    border-top-left-radius: $hard-round;

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
    color: $color-content-default;

    .link-description {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
