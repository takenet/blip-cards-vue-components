import * as sanitize from 'sanitize-html'

const mixin = input => sanitize(input, { allowedTags: sanitize.defaults.allowedTags.filter(tag => tag !== 'iframe') })

export default {
  mixin
}
