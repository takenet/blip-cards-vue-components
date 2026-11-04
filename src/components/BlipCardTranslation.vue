<template>
  <div
    :class="['blip-card-translation', 'blip-card-translation--' + state, position, { 'blip-card-translation--inline': inline }]"
    aria-live="polite"
  >
    <span v-if="inline" class="blip-card-translation-separator" aria-hidden="true">·</span>
    <svg class="blip-card-translation-icon" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
    <span v-if="label" class="blip-card-translation-label">{{ label }}</span>
    <span v-if="label && actionLabel" class="blip-card-translation-separator" aria-hidden="true">·</span>
    <!-- aria-disabled instead of disabled: a natively disabled button drops focus while pending -->
    <button
      v-if="actionLabel"
      type="button"
      class="blip-card-translation-action"
      :aria-disabled="isPending ? 'true' : null"
      @click.stop="onClick"
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
    },
    // Rendered after the time inside a date row: prefixed with a separator.
    inline: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isPending() {
      return this.state === 'pending'
    }
  },
  methods: {
    onClick() {
      if (!this.isPending) {
        this.$emit('action')
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

// $vue-dark-blip (#15AFB2) is the closest teal to the design (#00838F); hosts may override it via the custom property.
$translation-link-color: var(--blip-cards-translation-link-color, #{$vue-dark-blip});

.blip-card-translation {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
  font-size: 11px;
  font-weight: normal;
  line-height: 14px;
  white-space: normal;
  color: $color-content-disable;
  clear: both;

  &.right {
    justify-content: flex-end;
  }

  &.blip-card-translation--inline {
    display: inline-flex;
    margin: 0 0 0 3px;
    clear: none;
  }

  .blip-card-translation-icon {
    flex-shrink: 0;
    color: $translation-link-color;
  }

  .blip-card-translation-action {
    padding: 0;
    margin: 0;
    border: 0;
    background: none;
    font: inherit;
    color: $translation-link-color;
    text-decoration: none;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }

    &[aria-disabled='true'] {
      color: inherit;
      text-decoration: none;
      cursor: default;
    }
  }
}
</style>
