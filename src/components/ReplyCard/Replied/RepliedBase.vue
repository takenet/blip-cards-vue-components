<template>
  <div>
    <replied-with-text 
      v-if="replied.type === 'text/plain'"
      :text="repliedValue"
    />
  </div>
</template>
  
<script>
  export default {
    name: 'replied-base',
    mixins: [],
    props: {
      replied: {
        type: Object,
        default: {}
      }
    },
    computed: {
      repliedValue() {
        return this.replied.value
      }
    },
    created() {
      console.log(this.replied)
    },
    methods: {
    }
  }
</script>
  