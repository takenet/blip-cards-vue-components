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
        const emojiCodePoints = this.emoji.map((code) => String.fromCodePoint(code))
        const parsedEmoji = emojiCodePoints.join('')
        return parsedEmoji
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
      align-items: center;

      &.left,&.middle {
        bottom: 12px;
        left: 24px;
        background-color: $color-surface-1;
      }

      &.right {
        bottom: 12px;
        right: 24px;
        background-color: $color-content-default;
      }
    }
</style>
  