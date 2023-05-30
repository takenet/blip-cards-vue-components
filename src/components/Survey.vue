<script>
import numeric3 from '../assets/img/survey/numbers3.png'
import numeric5 from '../assets/img/survey/numbers5.png'
import star3 from '../assets/img/survey/stars3.png'
import star5 from '../assets/img/survey/stars5.png'
import { default as base } from '../mixins/baseComponent.js'
import { isFailedMessage } from '../utils/misc'

export const RECOMENDATION_SURVEY = 'recomendationSurvey'
export const SOLUTION_SURVEY = 'solutionSurvey'
export const CHATBOT_SURVEY = 'chatbotSurvey'

export const NUMERIC = 'numeric'
export const STAR = 'star'

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
    },
    saveButtonLabel: {
      type: String,
      default: 'Save'
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
      star5,
      isScoredActivated: false,
      isScoreFormFinished: false
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
      this.score = this.document.score || 0
      this.numberOfIcons = 0
      this.changeScale()
    },
    getTitlePreview: function () {
      switch (this.type) {
        case RECOMENDATION_SURVEY:
          return 'Would you recommend our Chatbot?'
        case SOLUTION_SURVEY:
          return 'How did you feel about the service on this channel?'
        case CHATBOT_SURVEY:
          return 'How did you feel about the chatbot assistance?'
        default:
          return 'How did you feel about the service on this channel?'
      }
    },
    getDescriptionPreview: function (positiveLabel) {
      if (positiveLabel) {
        return this.type === RECOMENDATION_SURVEY ? 'Recommend' : 'Positive'
      } else {
        return this.type === RECOMENDATION_SURVEY
          ? "Don't Recommend"
          : 'Negative'
      }
    },
    changeScale: function () {
      this.isStarIcon = this.scale.includes(STAR)
      this.isScoredActivated = false
      this.numberOfIcons = parseInt(
        this.scale.indexOf(NUMERIC) !== -1
          ? this.scale.split(NUMERIC)[1]
          : this.scale.split(STAR)[1]
      )
    },
    changeQuestion: function () {
      this.question = this.getTitlePreview()
    },
    setScore: function (value) {
      this.score = parseInt(value)

      const collectionSurveyItems = this.isStarIcon ? document.getElementsByClassName('survey-item-star') : document.getElementsByClassName('survey-item-number')
      Array.from(collectionSurveyItems).forEach(el => {
        el.classList.remove('active')
      })
      if (this.isStarIcon) {
        while (value >= 0) {
          const currentItem = document.getElementsByClassName('star' + value)[0]
          if (currentItem) {
            currentItem.classList.add('active')
          }
          value--
        }
      } else {
        const currentItem = document.getElementsByClassName('number' + value)[0]
        currentItem.classList.add('active')
      }
      if (!this.isScoredActivated) {
        this.isScoredActivated = true
      }
    },
    editingModeSave: function () {
      this.saveForm()
    },
    surveySave: function () {
      this.isScoreFormFinished = true
      this.saveForm()
    },
    saveForm: function () {
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
  line-height: normal;
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
      margin: 10px 0 0px;
      color: rgba(115, 129, 146, 1);
      font-size: 1.1rem;
      text-align: center;
    }
    &-survey {
      margin-bottom: 10px;
      font-size: 0.7rem;
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

.survey {
  &-row {
    display: flex;
  }

  &-cell {
    flex-grow: 1;
    font-size: 0.7rem;
    text-align: center;
  }

  &-score {
    margin-top: 15px;
    text-align: center;
  }

  &-item{
    margin: 0 10px;
    cursor: pointer;

    &-number{
      padding: 5px 8px;
      background-color: $vue-light-gray;
      border-radius: 5px;
      color: #fff;
      text-align: center;
      &:hover, &.active{
        background-color: $primary-color;        
      }
    }

    &-star{
      display: inline-block;
      height: 24px;
      width: 24px;
      background-repeat: no-repeat;
      background-image: url('~@/assets/img/survey/star.svg');

      &:hover, &.active{
        background-image: url('~@/assets/img/survey/star_fill.svg');
      }
    }
  }

  .button {
    width: 100%;
    margin-top: 10px;
    padding: 5px 16px;
    
    background-color: $primary-color;
    border: solid 1px $primary-color;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    font-size: 0.9rem;

    &:focus {
      outline:0;
      border: 1px solid $color-disabled-bg;
    }
  }
  .icon-margin {
    margin-right: 7%;
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
      <bds-button-icon v-if="deletable"
        class="editIco trashIco icon-margin"
        icon="trash"
        variant="delete"
        size="short"
        :disabled="isScoreFormFinished"
        v-on:click="trash(document)"
      ></bds-button-icon>
      <bds-button-icon v-if="editable"
        class="editIco icon-margin"
        icon="edit"
        variant="primary"
        :disabled="isScoreFormFinished"
        size="short"
        v-on:click="toggleEdit"
      ></bds-button-icon> 
      <div v-if="this.type || this.question || this.scale">
        <div class="container-survey">
          <h1 class="container-title">{{ getTitlePreview(type) }}</h1>
        </div>
        <div class="container-survey">
          <div class="survey-row">
            <div class="survey-cell">
              {{ getDescriptionPreview(false) }}
            </div>
            <div class="survey-cell">
              {{ getDescriptionPreview(true) }}
            </div>
          </div>
        </div>

        <div v-if="deletable && editable" class="container-survey">
          <div class="survey-score">
            <img v-if="scale === 'numeric3'" :src="numeric3" />
            <img v-if="scale === 'numeric5'" :src="numeric5" />
            <img v-if="scale === 'star3'" :src="star3" />
            <img v-if="scale === 'star5'" :src="star5" />
          </div>
        </div>
        <div v-if="!deletable && !editable" class="container-survey">
          <div class="survey-score">
            <span
              v-for="item in numberOfIcons"
              v-bind:key="item"
              @click="setScore(item)"
              class="survey-item"
              :data-value="item"
              :class="{ 'is-disabled' : isScoreFormFinished}"
              :ref="'item'+item"
            >
              <span v-if="!isStarIcon" :data-value="item" class='survey-item-number' :class="'number' + item">{{item}}</span>
              <span v-else             :data-value="item" class='survey-item-star'   :class="'star' + item"  ></span>
            </span>
          </div>
          <div class="survey-score">
            <button
              v-if="isScoredActivated && score != 0"
              class="button primary-color"
              :class="{ 'is-disabled' : isScoreFormFinished}"
              @click="surveySave()"
              >{{ saveButtonLabel }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Editing mode -->
  <div v-else class="blip-container survey">
    <form :class="'bubble ' + position" novalidate v-on:submit.prevent>
      <bds-button-icon 
        class="btn saveIco closeIco"
        icon="close"
        variant="ghost"
        size="short"
        v-on:click="cancel()"
      ></bds-button-icon>
      <bds-button-icon 
        class="btn saveIco"
        icon="check"
        variant="primary"
        size="short"
        :disabled="errors.any()"
        v-on:click="editingModeSave()">
      </bds-button-icon>
      <div class="form-group">
        <div class="container-survey">
          <span class="message--label">{{ surveyTypeLabel }}</span>
          <select
            v-on:change="changeQuestion"
            v-model="type"
            class="form-control text"
            v-validate="'required'"
          >
            <option disabled value></option>
            <option value="recomendationSurvey">
              Would you recommend this bot?
            </option>
            <option value="reviewSurvey">Chatbot attendance assessment</option>
            <option value="chatbotSurvey">Problem resolution assessment</option>
          </select>
          <span v-show="errors.has('title')" class="help input-error">{{
            errors.first('title')
          }}</span>
        </div>

        <div class="container-survey">
          <span class="message--label">{{ introductionLabel }}</span>
          <textarea readonly v-model="question" class="form-control text">
          </textarea>
          <span v-show="errors.has('title')" class="help input-error">{{
            errors.first('title')
          }}</span>
        </div>

        <div class="container-survey">
          <span class="message--label">{{ scaleLabel }}</span>
          <select
            v-on:change="changeScale"
            v-model="scale"
            class="form-control text"
            v-validate="'required'"
          >
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

