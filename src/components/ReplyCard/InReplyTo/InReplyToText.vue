<template>
  <div class="message-replied-container">
    <bds-grid direction="column"  gap="1">
      <bds-typo variant="fs-14" bold="bold" :margin="false" v-if="replyingToText" class="typo text-replying">{{replyingToText}}</bds-typo>
      <bds-grid container direction="row" gap="1" justifyContent="space-between" v-if="isLink">
        <bds-icon theme="outline" name="link" size="medium" class="typo"/>
        <bds-typo>{{  getText().link ?  getText().link : '' }}</bds-typo>
      </bds-grid>
     
      <bds-typo
        v-if="getText().text"
        tag="p"
        variant="fs-16"
        :bold="hasDescription ? 'bold' : 'regular'"
        margin="false"
        class="message-replied-text typo"
        :class="{ 'single': !hasDescription, 'title': hasDescription }"
      >{{ getText().text }}</bds-typo>

      <bds-typo
        v-if="hasDescription"
        tag="p"
        variant="fs-16"
        bold="regular"
        margin="false"
        class="message-replied-text description typo-light" v-html="sanitize(inReplyToDescription)"
      />
    </bds-grid>
  </div>
</template>

<script>
  export default {
    name: 'in-reply-to-text',
    mixins: [],
    props: {
      inReplyTo: {
        type: Object,
        default: () => ({})
      },
      replyingToText: {
        type: String,
        default: null
      }
    },
    computed: {
      isApplicationJsonType() {
        return this.inReplyTo.type === 'application/json'
      },
      interactiveHeader() {
        return this.inReplyTo.value.interactive.header
      },
      interactiveHeaderText() {
        return this.inReplyTo.value.interactive.header.text
      },
      interactiveBodyText() {
        return this.inReplyTo.value.interactive.body.text
      },
      inReplyToText() {
        switch (this.inReplyTo.type) {
          case 'text/plain':
            return this.inReplyTo.value
          case 'application/vnd.lime.select+json':
            return this.inReplyTo.value.text
          case 'application/json':
            return this.interactiveHeader ? this.interactiveHeaderText : this.interactiveBodyText
          default:
            return ''
        }
      },
      inReplyToDescription() {
        return this.isApplicationJsonType && this.interactiveHeader ? this.interactiveBodyText : ''
      },
      hasDescription() {
        return Boolean(this.inReplyToDescription)
      },
      isLink() {
        const urlPattern = /(https?:\/\/[^\s]+)/g
        const matches = this.inReplyTo.value.match(urlPattern)

        return matches && matches.length === 1
      }
    },
    methods: {
      getText() {
        const urlPattern = /(https?:\/\/[^\s]+)/g
        const matches = this.inReplyTo.value.match(urlPattern)

        if (matches && matches.length === 1) {
          const link = matches[0]
          return {
            text: this.inReplyTo.value.replace(urlPattern, '').trim(),
            link
          }
        }

        return {text: this.inReplyTo.value}
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/variables.scss';

  .message-replied-container {
    padding: 0.5rem;
  }

  .message-replied-text {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    margin: 0;
    text-align: left;

    &.single {
      -webkit-line-clamp: 3;
    }

    &.title {
      -webkit-line-clamp: 1;
    }

    &.description {
      -webkit-line-clamp: 2;
    }
  }
</style>
