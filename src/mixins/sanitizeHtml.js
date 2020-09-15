import * as sanitize from 'sanitize-html'

const mixin = (input, disableLink) => {
  if (disableLink) {
    return sanitize(input, { allowedTags: sanitize.defaults.allowedTags.filter(tag => ((tag !== 'iframe') && (tag !== 'a'))).concat(['u']) })
  } else {
    return sanitize(input, { allowedTags: sanitize.defaults.allowedTags.filter(tag => tag !== 'iframe').concat(['u']) })
  }
}

export default {
  mixin
}
