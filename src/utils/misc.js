function linkify(inputText, disableLink) {
  if (!inputText) {
    return ''
  }

  if (isTagA(inputText)) {
    return encodeHTML(inputText)
  }

  if (disableLink) {
    return inputText
  }

  // [label](signed media link): shows the file name instead of the long address.
  // The generic patterns run only on the text between these links, so they never reach the anchors.
  let output = ''
  let lastIndex = 0
  replaceNamedMediaLinks(inputText, (match, label, uri, offset) => {
    output += linkifyPlainText(inputText.slice(lastIndex, offset)) +
      `<a href="${uri}" target="_blank" rel="noopener noreferrer">${label}</a>`
    lastIndex = offset + match.length
    return match
  })

  return output + linkifyPlainText(inputText.slice(lastIndex))
}

function linkifyPlainText(inputText) {
  // Validating url correct Pattern
  // http://, https://, ftp://
  // eslint-disable-next-line no-useless-escape
  const urlValidPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim

  // Pseudo URL correct Pattern
  // www. without http:// or https://
  const pseudoUrlValidPattern = /(^|[^/])(www\.[\S]+(\b|$))/gim

  // Email address correct Pattern
  // Email addresses
  const emailAddressValidPattern = /[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim

  return inputText
    .replace(urlValidPattern, '<a href="$&" target="_blank">$&</a>')
    .replace(pseudoUrlValidPattern, '$1<a href="https://$2" target="_blank">$2</a>')
    .replace(emailAddressValidPattern, '<a href="mailto:$&" target="_blank">$&</a>')
}

// [label](https://...)
const namedMediaLinkPattern = /\[([^[\]\r\n]{1,200})\]\((https?:\/\/[^\s()"'<>]+)\)/g

// Only links to uploaded files with a plain label are shown as the label. The uri goes into a
// double-quoted attribute (the pattern refuses quotes, '<', '>' and spaces in it) and the label
// into the text of the anchor, so neither can end what contains it.
function isNamedMediaLink(label, uri) {
  return isSignedMediaUri(uri) && !/:\/\/|www\./i.test(label) && !/[<>"]/.test(label)
}

// A link written inside a tag (e.g. in an attribute value) is left as it is: an anchor there would
// break the tag. Any '<' not closed by a '>' before the link counts as an open tag.
function isInsideTag(inputText, offset) {
  return inputText.lastIndexOf('<', offset) > inputText.lastIndexOf('>', offset)
}

// Calls replacer(match, label, uri, offset) for each [label](uri) shown as the label; other matches are kept
function replaceNamedMediaLinks(inputText, replacer) {
  return inputText.replace(namedMediaLinkPattern, (match, label, uri, offset) =>
    isNamedMediaLink(label, uri) && !isInsideTag(inputText, offset) ? replacer(match, label, uri, offset) : match
  )
}

// Links to uploaded files are signed (Azure SAS): they carry an expiry (se) and a signature (sig)
function isSignedMediaUri(uri) {
  return /[?&;]se=/.test(uri) && /[?&;]sig=/.test(uri)
}

function isTagA(inputText) {
  const tagAPattern = /href\s*=/i
  if (inputText.search(tagAPattern) !== -1) {
    return true
  }
  return false
}

function encodeHTML(inputText) {
  return inputText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function isFailedMessage(status, position) {
  if (status === 'failed' && position === 'right') {
    return ' failed-message'
  }

  return ''
}

export {
  linkify,
  isSignedMediaUri,
  guid,
  isFailedMessage,
  isTagA,
  encodeHTML
}
