<template>
  <div class="replied-text">
    <bds-typo class="typo" tag="span" variant="fs-16" margin="false" v-html="sanitize(repliedText, { disallowedTagsMode: 'escape' })"></bds-typo>
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

<style lang="scss" scoped>
  .replied-text {
    overflow-wrap: anywhere;
    word-break: break-word;
  }
</style>
