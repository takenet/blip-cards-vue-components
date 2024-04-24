<template>
  <bds-grid
    class="website"
    direction="row"
    align-items="center"
    justify-content="center"
    gap="half"
    padding="y-2"
    @click="() => goToWebsite(button)"
  >
    <bds-icon v-if="position === 'right'" size="small" name="external-file" theme="outline" color="white" />
    <bds-icon v-else size="small" name="external-file" theme="outline" />
    <bds-typo variant="fs-16" bold="regular" :class="'typo ' + position">{{ button.text }}</bds-typo>
  </bds-grid>  
</template>

<script>
export default {
  name: 'website-button',
  props: {
    button: {
      type: Object,
      default: {
        text: '',
        url: ''
      }
    },
    position: {
      type: String,
      default: 'left'
    }
  },
  methods: {
    goToWebsite(button) {
      const parameter = button.parameter
      let link = button.url

      if (parameter) {
        link = link.replace(`{{1}}`, parameter)
      }

      window.open(link, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';

.website {
  width: 100%;
  border-top: 1px solid $color-content-disable;
  cursor: pointer;
}
</style>
