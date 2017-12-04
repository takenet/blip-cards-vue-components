<template>
  <div v-if="!isEditing">
    <div class="blip-container chat-state">
      <div :class="'bubble ' + position">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg" />
        </div>
        <div v-if="editable" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>
        <div class="typing">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="blip-container" v-else>
  <div :class="'bubble ' + position">
      <form novalidate v-on:submit.prevent>
        <div class="saveIco closeIco" @click="cancel()" >
          <img :src="closeSvg" />
        </div>
        <div class="saveIco" @click="saveState()" :class="{'is-disabled': errors.any() }">
          <img :src="approveSvg" />
        </div>
        <div class="form-group">
          <input type="text" name="interval" class="form-control" v-validate="'required|numeric'"
            :class="{'input-error': errors.has('interval') }" v-model="interval" placeholder="Milliseconds to wait"></input>
          <span v-show="errors.has('interval')" class="help input-error">{{ errors.first('interval') }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'chat-state',
  mixins: [
    base
  ],
  data: function () {
    return {
      interval: this.document.interval ? this.document.interval : null
    }
  },
  methods: {
    saveState: function () {
      this.save({
        ...this.document,
        interval: this.interval
      })
    },
    cancel: function () {
      this.interval = this.document.interval ? this.document.interval : null
      this.isEditing = false
    }
  }
}
</script>


<style lang="scss" scoped>
   @import '../styles/variables.scss';

    .chat-state .bubble {
      padding: $bubble-padding;
      word-wrap: break-word;
      min-width: auto;

      .typing {
        display: inline-block;
        }
        .typing .typing-dot {
            float: left;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin: 2px;
            background: #929292;
            animation-name: bounce;
            animation-duration: 0.8s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
        }

        .typing .typing-dot:nth-child(2) {
            animation-delay: 0.1s;
        }
        .typing .typing-dot:nth-child(3) {
            animation-delay: 0.2s;
        }

        @keyframes bounce {
            0% {
                transform: translateY(0px);
            }
            30% {
                transform: translateY(-6px);
            }
            100% {
                transform: translateY(0px);
            }
        }
   }

</style>