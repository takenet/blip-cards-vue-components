<script>
import numeric3 from '../assets/img/survey/numbers3.png'
import numeric5 from '../assets/img/survey/numbers5.png'
import star3 from '../assets/img/survey/stars3.png'
import star5 from '../assets/img/survey/stars5.png'
import { default as base } from '../mixins/baseComponent.js'
import { isFailedMessage } from '../utils/misc'
export default {
  name: 'survey',
  mixins: [base],
  props: {
    status: {
      type: String,
      default: ''
    },
    initEditing: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    failedToSendMsg: {
      type: String,
      default: 'Failed to send a message'
    },
    surveyTypeLabel: {
      type: String,
      default: 'Survey type'
    },
    introductionLabel: {
      type: String,
      default: 'Introduction text message'
    },
    scaleLabel: {
      type: String,
      default: 'Scale'
    }
  },
  data: function () {
    return {
      title: this.document.title,
      type: this.document.type || 'recomendationSurvey',
      scale: this.document.scale || 'numeric5',
      question:
        this.document.question || 'Would you recommend our product? Rate us',
      score: this.document.score,
      isFailedMessage,
      numeric3,
      numeric5,
      star3,
      star5
    }
  },
  methods: {
    init: function () {
      this.title = this.document.title
      this.text = this.document.text
      this.type = this.document.type || 'recomendationSurvey'
      this.scale = this.document.scale || 'numeric5'
      this.question =
        this.document.question || 'Would you recommend our product? Rate us'
      this.score = this.document.score || 5
    },
    getTitlePreview: function () {
      switch (this.type) {
        case 'recomendationSurvey':
          return 'Would you recommend our Chatbot?'
        case 'solutionSurvey':
          return 'How did you feel about the service on this channel?'
        case 'chatbotSurvey':
          return 'How did you feel about the chatbot assistance?'
        default:
          return 'How did you feel about the service on this channel?'
      }
    },
    getDescriptionPreview: function(positiveLabel) {
      if (positiveLabel) {
        return this.type === 'recomendationSurvey' ? 'Recommend' : 'Positive'
      } else {
        return this.type === 'recomendationSurvey' ? "Don't Recommend" : 'Negavite'
      }
    },
    surveySave: function () {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        this.save({
          ...this.document,
          type: this.type,
          scale: this.scale,
          question: this.question,
          score: this.score,
          title: this.title,
          text: this.text
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.survey .bubble {
  
  &.right .text-wrapper:after {
    background: $vue-light-blip !important;
  }

  &.text-link {
    padding: $bubble-padding;
    height: auto;
  }

  .form-group {
    min-width: auto;
    .form-control.title {
      margin-top: 10px;
    }
    .form-control.text {
      margin-top: 0px;
    }
  }

  .container {
    &-title {
      font-size: 1.1rem;
      text-align: center;
    }
    &-survey {
      margin-bottom: 8px;
      font-size: 0.8rem;
      text-align: left;
    }
  }

  .survey-wrapper {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    border-radius: inherit;
    overflow: hidden;

    &.link {
      cursor: pointer;
    }

    .preview {
      height: 100px;
      width: 100px;
      min-width: 100px;
      background-position: center;
      background-size: cover;
    }

    .link-description-wrapper {
      display: flex;
      flex-direction: column;
      padding: 10px 16px;
      overflow: hidden;
      min-height: 100px;

      .text {
        overflow: hidden;
        position: relative;
        text-overflow: ellipsis;
      }

      .big-text {
        white-space: nowrap;
      }

      .text-wrapper {
        overflow: hidden;
        position: relative;
        line-height: 1.2em;
        max-height: 2.4em;
        text-align: justify;
        margin-right: 3px;
        padding-right: 13px;
        span {
          line-height: 1.2em;
        }
      }

      .light-text {
        font-size: 12px;
        font-weight: 100;
        flex-grow: 1;
      }

      .text-wrapper:before {
        content: ' ...';
        position: absolute;
        right: 0;
        bottom: 0;
      }

      .text-wrapper:after {
        content: '';
        position: absolute;
        right: 0;
        width: 1em;
        height: 1em;
        margin-top: 0.2em;
        background: $vue-white;
      }

      .small-text {
        font-size: 10px;
        font-weight: 100;
        white-space: nowrap;
      }

      .space-between-text {
        flex-grow: 1;
      }
    }
  }

  .blip-weblink-metadata {
    margin-top: -8px;
    padding: 0 10px 0 0;
  }
}

.survey{
  &-row {
    display: flex;
  }

  &-cell {
    flex-grow: 1;
    font-size: 0.7rem;
    text-align: center;
  }

  &-score{
    text-align: center;
  }
}
</style>

<template>
  <!-- Preview sidebar -->
  <div
    v-if="!isEditing"
    class="blip-container survey"
    :class="isFailedMessage(status, position)"
  >
    <div
      :class="
        'bubble ' +
        position +
        (this.title == null && this.text == null ? ' text-link' : '')
      "
    >
      <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>
      <div v-if="this.type || this.question || this.scale">
        <div class="container-survey">
          <h1 class="container-title">{{ getTitlePreview(type) }}</h1>
        </div>
        <div class="container-survey">
          <div class="survey-row">
            <div class="survey-cell">
              {{getDescriptionPreview(false)}}
            </div>
            <div class="survey-cell">
              {{getDescriptionPreview(true)}}
            </div>
          </div>
        </div>
        <div class="container-survey">
          <div class="survey-score">
            <img v-if="scale === 'numeric3'" :src=numeric3 />
            <img v-if="scale === 'numeric5'" :src=numeric5 />
            <img v-if="scale === 'star3'" :src=star3 />
            <img v-if="scale === 'star5'" :src=star5 />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Editing mode -->
  <div v-else class="blip-container survey">
    <form :class="'bubble ' + position" novalidate v-on:submit.prevent>
      <button
        class="btn saveIco"
        @click="surveySave()"
        :class="{ 'is-disabled': errors.any() }"
      >
        <img :src="approveSvg" />
      </button>
      <button class="btn saveIco closeIco" @click="cancel()">
        <img :src="closeSvg" />
      </button>
      <div class="form-group">
        <div class="container-survey">
          <span class="message--label">{{ surveyTypeLabel }}</span>
          <select v-model="type" class="form-control text">
            <option disabled value></option>
            <option value="recomendationSurvey">
              Would you recommend this bot?
            </option>
            <option value="reviewResolution">
              Did you solve your problem?
            </option>
            <option value="chatbotResolution">
              Did your problem has been solved?
            </option>
          </select>
          <span v-show="errors.has('title')" class="help input-error">{{
            errors.first('title')
          }}</span>
        </div>

        <div class="container-survey">
          <span class="message--label">{{ introductionLabel }}</span>
          <textarea v-model="question" class="form-control text"> </textarea>
          <span v-show="errors.has('title')" class="help input-error">{{
            errors.first('title')
          }}</span>
        </div>

        <div class="container-survey">
          <span class="message--label">{{ scaleLabel }}</span>
          <select v-model="scale" class="form-control text">
            <option value="numeric3">Number 1 to 3</option>
            <option value="numeric5">Number 1 to 5</option>
            <option value="star3">Stars 1 to 3</option>
            <option value="star5">Stars 1 to 5</option>
          </select>
          <span v-show="errors.has('title')" class="help input-error">{{
            errors.first('title')
          }}</span>
        </div>
      </div>
    </form>
  </div>
</template>

