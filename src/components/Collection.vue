<template>
  <div :class="'container collection'">
    <div :class="'bubble ' + position">

      <div class=''  v-for="item in document.content.items">
        <document-select :position="position" :on-selected="onSelected" :document="item" />
      </div>
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
</template>

<script>

export default {
  props: {
    document: {
      type: Object,
      required: true
    },
    position: {
      type: String,
      default: 'left'
    },
    date: {
      type: String
    },
    onSelected: {
      type: Function
    }
  }
}
</script>

<style lang="scss">
   @import '../styles/variables.scss';

</style>
