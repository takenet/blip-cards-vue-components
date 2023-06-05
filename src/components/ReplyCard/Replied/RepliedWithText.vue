<template>
    <div>
        <bds-typo tag="span" variant="fs-16" margin="false">{{ repliedText }}</bds-typo>
    </div>
</template>
  
  <script>
  import { default as base } from '../../../mixins/baseComponent.js'
  
  export default {
    name: 'replied-with-text',
    mixins: [base],
    props: {
      text: {
        type: String,
        default: ''
      }
    },
    computed: {
      repliedText() {
        return this.text
      }
    },
    created() {
      console.log(this.document)
    },
    methods: {
    }
  }
  </script>
  
  <style lang="scss" scoped>
  @import '../../../styles/variables.scss';
  </style>
  