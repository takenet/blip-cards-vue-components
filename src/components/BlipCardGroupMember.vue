<template>
  <div class="flex" :class="`${isGroup ? 'group-' : ''}notification ` + position">
    {{ groupMember }}
  </div>
</template>

<script>
export default {
  name: 'blip-card-group-member',
  props: {
    position: {
      type: String,
      default: 'left'
    },
    groupMember: {
      type: String
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  }
}
</script>


<style scoped lang="scss">
.blip-message-group .blip-card-group .group-notification.left,
.group-notification.right {
  float: none !important;
}

.blip-message-group .blip-card-group .group-notification.left {
  display: flex;
  justify-content: flex-start;
}

.blip-message-group .blip-card-group .group-notification.right {
  display: flex;
  justify-content: flex-end;
}
</style>
