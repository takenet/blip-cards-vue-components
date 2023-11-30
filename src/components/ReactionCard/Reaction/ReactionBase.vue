<template>
  <bds-grid class="emoji-container">
    <bds-typo variant="fs-14" tag="span" margin="false">{{ parsedEmoji }}</bds-typo>
</bds-grid>
</template>

<script>
  export default {
    name: 'reaction-base',
    mixins: [],
    props: {
      emoji: {
        type: [],
        default: undefined
      }
    },
    computed: {
      hasEmoji() {
        return Boolean(this.emoji)
      },
      parsedEmoji() {
        const e = this.emoji.map(e => { return '\\u' + e.toString(16).toUpperCase() }).join('')
        return e.replace(/\\u(....)/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))
          .replace(/\\(\d{3})/g, (_, p1) => String.fromCharCode(parseInt(p1, 8)))
      }
    }
  }
</script> 
<style lang="scss" scoped>
  @import '../../../styles/variables.scss';

  .emoji-container {
      border-radius: 50%;
      background-color: $color-surface-1;
      position: absolute;
      border: 1px solid $color-content-ghost;
      width: 28px;
      height: 28px;
      justify-content: center;
      bottom: -14px;
      right: 4px;
    }
</style>
  