<template>
  <div id="media-container">
    <div v-if="componentImage !== undefined"
      :class="position">
      <blip-image 
        :document="componentImage"
        :async-fetch-media="asyncFetchMedia"/>
    </div>
    <!-- <div v-if="componentVideo !== undefined"
      :class="position">
      <blip-video 
        :document="componentVideo"
        :async-fetch-media="asyncFetchMedia"/>
    </div> -->
    <div v-if="componentAudio !== undefined"
      :class="position">
      <blip-audio 
        :document="componentAudio"
        :async-fetch-media="asyncFetchMedia"/>
    </div>
    <div v-if="componentDocument !== undefined"
      :class="position">
      <blip-file 
        :document="componentDocument"
        :async-fetch-media="asyncFetchMedia"/>
    </div>
  </div>
</template>
  
<script>

import BlipImage from '../MediaLink/Image'
import BlipAudio from '../MediaLink/Audio'
// import BlipVideo from '../MediaLink/Video'
import BlipFile from '../MediaLink/BlipFile'
import { parseComponentImage, parseComponentAudio, parseComponentDocument } from '@/utils/TemplateContent'

export default {
  name: 'media-content',
  props: {
    document: {},
    asyncFetchMedia: {
      type: Function
    }
  },
  data: function() {
    return {
      componentImage: {},
      // componentVideo: {}
      componentDocument: {},
      componentAudio: {}
    }
  },
  created() {
    this.componentImage = parseComponentImage(this.document)
    this.componentAudio = parseComponentAudio(this.document)
    this.componentDocument = parseComponentDocument(this.document)
  },
  components: {
    BlipImage,
    BlipAudio,
    // BlipVideo
    BlipFile
  },
  methods: {
    emitUpdate () {
      this.$emit('updated')
    }
  }
}
</script>
  