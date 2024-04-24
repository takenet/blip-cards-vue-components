<template>
  <div>
    <bds-typo class="typo" tag="span" variant="fs-16" margin="false" v-html="sanitize(repliedText)"></bds-typo>
  </div>
</template>

<script>
  export default {
    name: 'replied-with-text',
    mixins: [],
    props: {
      text: {
        type: String,
        default: ''
      }
    },
    computed: {
      repliedText() {
        return this.text
      }
    }
  }
</script>
