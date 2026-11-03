<template>
  <div :class="'blip-card-translation blip-card-translation--' + state + ' ' + position">
    <span v-if="label" class="blip-card-translation-label">{{ label }}</span>
    <span v-if="label && actionLabel" class="blip-card-translation-separator" aria-hidden="true">·</span>
    <button
      v-if="actionLabel"
      type="button"
      class="blip-card-translation-action"
      @click.stop="$emit('action')"
      @dblclick.stop
    >{{ actionLabel }}</button>
  </div>
</template>

<script>
export default {
  name: 'blip-card-translation',
  props: {
    state: {
      type: String,
      default: 'none'
    },
    label: {
      type: String,
      default: ''
    },
    actionLabel: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'left'
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.blip-card-translation {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 12px;
  line-height: 16px;
  white-space: normal;
  text-align: left;
  color: $color-content-ghost;

  &.right {
    color: $color-surface-2;
  }

  .blip-card-translation-action {
    padding: 0;
    margin: 0;
    border: 0;
    background: none;
    font: inherit;
    font-weight: 600;
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
  }
}

.media-link .bubble .blip-card-translation {
  padding: 0 16px 10px;
}
</style>
