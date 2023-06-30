<template>
  <div>
    <blip-file
      :title-msg="titleMsg"
      :document="repliedDocument"
      :full-document="fullDocument"
      :position="position"
      :date="date"
      :editable="editable"
      :on-media-selected="onMediaSelected"
      :on-save="save"
      :on-deleted="onDeleted"
      :on-metadata-edit="isMetadataReady"
      :deletable="deletable"
      :on-cancel="onCancel"
      :editing="editing"/>
  </div>
</template>

<script>
  export default {
    name: 'replied-with-document',
    mixins: [],
    props: {
      document: {
        type: String,
        default: ''
      }
    },
    computed: {
      repliedDocument() {
        return this.document
      }
    }
  }
</script>
  