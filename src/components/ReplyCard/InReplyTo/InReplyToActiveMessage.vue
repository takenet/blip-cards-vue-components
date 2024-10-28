<template>
  <bds-grid direction="row" justifyContent="space-between" gap="2">
    <bds-grid direction="row"  gap="1"  align-items="center">
      <bds-grid direction="row" padding="1" gap="1" >
        <bds-grid>
          <bds-icon theme="outline" name="paperplane" size="medium" class="typo" />
        </bds-grid>
        <bds-grid direction="column" >
          <bds-typo tag="span" variant="fs-14" bold="regular" class="typo single-line-text-overflow-ellipsis">{{ templateTitle }}</bds-typo>
          <bds-typo tag="span" variant="fs-14" bold="regular" class="typo multiline-text-overflow-ellipsis"
            v-if="templateText">{{ templateText }}</bds-typo>
        </bds-grid>
      </bds-grid>
    </bds-grid>
    
    <bds-grid>
      <img
        v-if="templateImage"
        class="image-replied"
        :src="templateImage.uri"
      />
      <video
        v-if="templateVideo"
        :src="templateVideo.uri"
        ref="video"
        @loadedmetadata="captureThumbnail"
        class="video-replied"
      />
    </bds-grid>
  </bds-grid>
</template>
  
<script>
import { parseComponentImage, parseComponentVideo } from '@/utils/TemplateContent'

export default {
  name: 'in-reply-to-active-message',
  props: {
    inReplyTo: {
      type: Object,
      default: () => ({})
    },
    translations: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    templateTitle() {
      return (this.inReplyTo.value.template && this.inReplyTo.value.template.name)
        ? this.inReplyTo.value.template.name
        : this.translations.unsupportedContent
    },
    templateText() {
      return this.showTemplateContentBody()
    },
    templateImage() {
      return parseComponentImage(this.inReplyTo.value)
    },
    templateVideo() {
      return parseComponentVideo(this.inReplyTo.value)
    }
  },
  methods: {
    showTemplateContentBody() {
      let componentTemplateBody = this.inReplyTo.value.templateContent.components
        .filter(m => m.type === 'BODY')

      let bodyFilledVariables = this.inReplyTo.value.template.components
        .filter(m => m.type === 'body')

      if (componentTemplateBody) {
        componentTemplateBody = componentTemplateBody[0].text

        if (bodyFilledVariables.length) {
          bodyFilledVariables = bodyFilledVariables[0].parameters
          const regexFindVariablesInText = /\{\{(\d+)\}\}/g
          componentTemplateBody = componentTemplateBody.replace(regexFindVariablesInText, (match, index) => {
            const variable = bodyFilledVariables[index - 1]
            return variable ? variable.text : match
          })
        }
      }

      componentTemplateBody = this.sanitize(componentTemplateBody)

      return componentTemplateBody
    },
    captureThumbnail() {
      const video = this.$refs.video

      video.currentTime = 2
      this.timeVideo = this.formatDuration(video.duration)

      video.addEventListener('seeked', () => {
        this.canvasRendered = true
        this.$nextTick(() => {
          const canvas = this.$refs.canvas
          const context = canvas.getContext('2d')
          context.drawImage(video, 0, 0, 80, 80)
        })
      })
    },
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)

      const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds

      return `${minutes}:${formattedSeconds}`
    }
  }
}
</script>

<style scoped>
.image-replied {
  max-height: 80px;
}

.video-replied {
  max-height: 95px;
  margin-right: -4px;
  border-radius: 0 !important;
}
</style>