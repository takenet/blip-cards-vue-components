<template>
  <bds-grid
    class="phone-number"
    direction="row"
    align-items="center"
    justify-content="center"
    gap="half"
    padding="y-2"
    @click="() => goToPhone(button.phoneNnumber)"
  >
    <bds-icon v-if="position === 'right'" size="small" name="voip" theme="outline" color="white" />
    <bds-icon v-else size="small" name="voip" theme="outline" />
    <bds-typo variant="fs-16" bold="regular" :class="'typo ' + position">{{ button.text }}</bds-typo>
  </bds-grid>
</template>

<script>
export default {
  name: 'phone-number-button',
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
    goToPhone(phoneNumber) {
      window.open(`tel:${phoneNumber}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';

.phone-number {
  width: 100%;
  border-top: 1px solid $color-content-disable;
  cursor: pointer;
}
</style>
