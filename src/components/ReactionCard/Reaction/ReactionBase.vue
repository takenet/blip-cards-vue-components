<template>
  <bds-grid :class="'emoji-container ' + position">
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
      },
      position: {
        type: String,
        default: 'left'
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
      position: absolute;
      border: 1px solid $color-content-ghost;
      width: 28px;
      height: 28px;
      justify-content: center;

      &.left,&.middle {
        bottom: -14px;
        right: 4px;
        background-color: $color-surface-1;
      }

      &.right {
        bottom: -14px;
        left: 4px;
        background-color: $color-content-default;
      }
    }
</style>
  