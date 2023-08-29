export const constants = {
  REGEX_FIND_TEXT_BETWEEN_ASTERISKS: /\*([^*]+)\*/g,
  REGEX_FIND_TEXT_BETWEEN_UNDERSCORES: /_([^*]+)_/g,
  REGEX_FIND_TEXT_BETWEEN_TILDES: /~([^*]+)~/g,
  REGEX_FIND_LINE_BREAK: /\\n/g
}

export const formatText = (text, style) => {
  console.log('style ', style)
  if (!text) {
    return ''
  }

  text = text.replace(/<[^>]+>/gm, '')
  text = formatBold(text, style)
  text = formatItalic(text, style)
  text = formatStrikeThrough(text, style)
  text = formatLineBreak(text)

  return text
}

const formatBold = (text, style) => {
  return text.replace(constants.REGEX_FIND_TEXT_BETWEEN_ASTERISKS, '<bds-typo class="' + style + '" variant="fs-16" tag="span" bold="bold">$1</bds-typo>')
}

const formatItalic = (text, style) => {
  return text.replace(constants.REGEX_FIND_TEXT_BETWEEN_UNDERSCORES, '<bds-typo class="' + style + '" variant="fs-16" italic tag="span">$1</bds-typo>')
}

const formatStrikeThrough = (text, style) => {
  return text.replace(constants.REGEX_FIND_TEXT_BETWEEN_TILDES, '<bds-typo class="' + style + '" variant="fs-16" tag="span" class="text-line-through">$1</bds-typo>')
}

const formatLineBreak = (text) => {
  return text.replace(constants.REGEX_FIND_LINE_BREAK, '<br>')
}
