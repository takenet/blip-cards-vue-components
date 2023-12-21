const COMPONENT_BUTTONS_TYPE = 'BUTTONS'
const BUTTONS_PROPERTY = 'buttons'
const PARAMETERS_PROPERTY = 'parameters'
const HEADER_TYPE = 'header'

export const BUTTON_TYPE = {
  PHONE_NUMBER: 'PHONE_NUMBER',
  QUICK_REPLY: 'QUICK_REPLY',
  URL: 'URL'
}

const MEDIA_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'file',
  AUDIO: 'audio'
}

const parseMediaComponent = (document, MEDIA_TYPE) => {
  const { template: { components = [] } = {} } = document || {}

  const elements = components
    .filter(({ type }) => type === HEADER_TYPE)
    .flatMap(component => component[PARAMETERS_PROPERTY])
    .filter(({ type }) => type === MEDIA_TYPE)
    .flatMap(parameter => parameter[MEDIA_TYPE])
    .map((element) => ({
      uri: element.link,
      authorizationRealm: 'blip',
      type: MEDIA_TYPE
    }))

  return elements[0]
}

export const parseComponentImage = (documento) => {
  return parseMediaComponent(documento, MEDIA_TYPE.IMAGE)
}

export const parseComponentVideo = (documento) => {
  return parseMediaComponent(documento, MEDIA_TYPE.VIDEO)
}

export const parseComponentDocument = (documento) => {
  return parseMediaComponent(documento, MEDIA_TYPE.DOCUMENT)
}

export const parseComponentAudio = (documento) => {
  return parseMediaComponent(documento, MEDIA_TYPE.AUDIO)
}

export const parseComponentButtons = (document) => {
  const { templateContent: { components = [] } = {} } = document || {}

  return components
    .filter(({ type }) => type === COMPONENT_BUTTONS_TYPE)
    .flatMap(component => component[BUTTONS_PROPERTY])
    .map((button, index) => ({
      ...button,
      parameter: getButtonParametersByIndex(document, '' + index)
    }))
}

export const getButtonParametersByIndex = (document, index) => {
  const { template: { components = [] } = {} } = document || {}

  const parameters = components
    .filter(component => component.index === index)
    .flatMap(({ parameters }) => parameters)
    .map(parameters => parameters.text)

  return parameters.length === 1 ? parameters[0] : ''
}
