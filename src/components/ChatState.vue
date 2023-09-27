<template>
  <div v-if="!isEditing">
    <div
      v-if="this.document.state === 'composing'"
      class="blip-container chat-state"
      :class="isFailedMessage(status, position)"
    >
      <div :class="'bubble ' + position">
        <bds-button-icon v-if="deletable"
          class="editIco trashIco"
          icon="trash"
          variant="delete"
          size="short"
          v-on:click="trash(document)"
        ></bds-button-icon>
        <bds-button-icon v-if="editable"
          class="editIco"
          icon="edit"
          variant="primary"
          size="short"
          v-on:click="toggleEdit"
        ></bds-button-icon> 
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
        <bds-button-icon 
          class="btn saveIco closeIco"
          icon="close"
          variant="ghost"
          size="short"
          v-on:click="cancel()">
        </bds-button-icon>
        <bds-button-icon 
          class="btn saveIco"
          icon="check"
          variant="primary"
          size="short"
          :disabled="errors.any()"
          v-on:click="saveState()"
        ></bds-button-icon>
        <div class="form-group">
          <input
            type="text"
            name="interval"
            class="form-control"
            v-validate="'required|numeric'"
            :class="{'input-error': errors.has('interval') }"
            v-model="interval"
            :placeholder="msToWaitMsg"
          >
          <span
            v-show="errors.has('interval')"
            class="help input-error"
          >{{ errors.first('interval') }}</span>
        </div>
        <button
          v-if="typeof onMetadataEdit === 'function'"
          class="define-metadata blip-chat-state-metadata"
          @click="editMetadata(fullDocument)"
        >{{ metadataButtonText }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import { isFailedMessage } from '../utils/misc'

export default {
  name: 'chat-state',
  mixins: [base],
  props: {
    status: {
      type: String,
      default: ''
    },
    msToWaitMsg: {
      type: String,
      default: 'Milliseconds to wait'
    }
  },
  data: function() {
    return {
      interval: undefined,
      isFailedMessage
    }
  },
  methods: {
    init: function() {
      this.interval = this.document.interval
        ? this.document.interval
        : undefined
    },
    saveState: function() {
      this.save({
        ...this.document,
        interval: this.interval
      })
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
  .summary{
    background-color: $color-warning !important;
  }
  .typing {
    display: inline-block;
  }
  .typing .typing-dot {
    float: left;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin: 2px;
    background: $color-content-default;
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

.blip-chat-state-metadata {
  margin-top: -20px;
  padding: 0 10px 10px 0;
}
</style>
