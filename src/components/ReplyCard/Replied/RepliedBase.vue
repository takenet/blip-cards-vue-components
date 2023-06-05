<template>
    <div>
        <replied-with-text 
            v-if="replied.type === 'text/plain'"
            :text="repliedValue"
        />
    </div>
</template>
  
  <script>
  import { default as base } from '../../../mixins/baseComponent.js'
  
  export default {
    name: 'replied-base',
    mixins: [base],
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
  
  <style lang="scss" scoped>
  @import '../../../styles/variables.scss';
  </style>
  