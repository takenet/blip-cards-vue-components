<template>
    <div class="blip-container blip-external">
      <h1>Soy yo!</h1>
    </div>
  </template>
  
  <script>
  import { default as base } from '../mixins/baseComponent.js'
  
  export default {
    name: 'blip-external',
    mixins: [base],
    props: {
      message: {
        type: Object,
        default: () => ({})
      }
    }
  }
  </script>
  
  <style lang="scss">
  @import '../styles/variables.scss';
  
  .blip-external .bubble {
    padding: $bubble-padding;
    word-wrap: break-word;
    min-width: auto !important;
    text-align: left;
  }
  </style>