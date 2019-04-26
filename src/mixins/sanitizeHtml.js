import * as sanitize from 'sanitize-html'

const mixin = input => sanitize(input, { allowedTags: sanitize.defaults.allowedTags.filter(tag => tag !== 'iframe').concat(['u']) })

export default {
  mixin
}
