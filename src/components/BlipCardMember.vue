<template>
  <div class="flex" :class="`${isGroup ? 'group-' : ''}notification ` + position">
    {{ memberInfo }}
  </div>
</template>

<script>
export default {
  name: 'blip-card-member',
  props: {
    position: {
      type: String,
      default: 'left'
    },
    memberInfo: {
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
.blip-message-group .blip-card-group .group-notification.left, .group-notification.right, 
.blip-card .notification.left, .notification.right {
  float: none !important;
}

.blip-message-group .blip-card-group .group-notification.left,
.blip-card .notification.left {
  display: flex;
  justify-content: flex-start;
}

.blip-message-group .blip-card-group .group-notification.right,
.blip-card .notification.right {
  display: flex;
  justify-content: flex-end;
}
</style>
