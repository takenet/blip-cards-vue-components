<template>
  <div>
    <replied-with-text 
      v-if="replied.type === 'text/plain'"
      :text="repliedValue"
    />
    <replied-with-document 
      v-if="replied.type.indexOf('application') != -1"
      :document="replied"
      :on-media-selected="onMediaSelected"
    />
  </div>
</template>
  
<script>
  export default {
    name: 'replied-base',
    mixins: [],
    props: {
      replied: {
        type: Object,
        default: {}
      },
      onMediaSelected: {
        type: Function
      }
    },
    computed: {
      repliedValue() {
        return this.replied.value
      }
    }
  }
</script>
  