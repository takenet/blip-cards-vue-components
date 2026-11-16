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

  // Only the text between tags is linkified: a link written in a tag (e.g. in an attribute value)
  // would put an anchor inside the tag and let its address add attributes to it.
  return splitTags(inputText)
    .map(part => part.isTag ? part.value : part.value
      .replace(urlValidPattern, '<a href="$&" target="_blank">$&</a>')
      .replace(pseudoUrlValidPattern, '$1<a href="https://$2" target="_blank">$2</a>')
      .replace(emailAddressValidPattern, '<a href="mailto:$&" target="_blank">$&</a>')
    )
    .join('')
}

// Tags read as the browser reads them (HTML tokenizer), so a '>' inside a quoted attribute value does
// not end the tag. Whatever is not closed (tag, quoted value, comment) runs to the end of the text.
const tagPattern = (() => {
  const space = '[\\t\\n\\f\\r ]'
  const value = `${space}*=${space}*(?:"[^"]*(?:"|$)|'[^']*(?:'|$)|[^\\t\\n\\f\\r >]*)`
  const attribute = `[^\\t\\n\\f\\r />][^\\t\\n\\f\\r />=]*(?:${value})?`
  return new RegExp(
    // comment
    '<!--(?:-?>|[\\s\\S]*?(?:--!?>|$))' +
    // <!doctype>, <?...>, </ not followed by a letter: up to the first '>'
    '|<[!?][^>]*(?:>|$)|</(?![a-zA-Z])[^>]*(?:>|$)' +
    // start and end tags with their attributes
    `|</?[a-zA-Z][^\\t\\n\\f\\r />]*(?:[\\t\\n\\f\\r /]+|${attribute})*(?:>|$)`,
    'g'
  )
})()

// Splits the text into its tags and the text between them: [{ value, start, isTag }]
function splitTags(inputText) {
  const parts = []
  let lastIndex = 0
  inputText.replace(tagPattern, (tag, offset) => {
    parts.push({ value: inputText.slice(lastIndex, offset), start: lastIndex, isTag: false })
    parts.push({ value: tag, start: offset, isTag: true })
    lastIndex = offset + tag.length
    return tag
  })
  parts.push({ value: inputText.slice(lastIndex), start: lastIndex, isTag: false })
  return parts
}

// [label](https://...)
const namedMediaLinkPattern = /\[([^[\]\r\n]{1,200})\]\((https?:\/\/[^\s()"'<>]+)\)/g

// Only links to uploaded files with a plain label are shown as the label. The uri goes into a
// double-quoted attribute (the pattern refuses quotes, '<', '>' and spaces in it) and the label
// into the text of the anchor, so neither can end what contains it.
function isNamedMediaLink(label, uri) {
  return isSignedMediaUri(uri) && !/:\/\/|www\./i.test(label) && !/[<>"]/.test(label)
}

// Calls replacer(match, label, uri, offset) for each [label](uri) shown as the label; other matches are kept.
// A link written inside a tag (e.g. in an attribute value) is left as it is: an anchor there would break
// the tag. Tags are read by splitTags, as in linkifyPlainText, so both agree on what is outside them.
function replaceNamedMediaLinks(inputText, replacer) {
  let parts
  let index = 0
  return inputText.replace(namedMediaLinkPattern, (match, label, uri, offset) => {
    if (!isNamedMediaLink(label, uri)) {
      return match
    }
    parts = parts || splitTags(inputText)
    // matches come in order: move to the part that contains the offset
    while (parts[index].start + parts[index].value.length <= offset) {
      index++
    }
    return parts[index].isTag ? match : replacer(match, label, uri, offset)
  })
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
