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
  DOCUMENT: 'document',
  AUDIO: 'audio'
}

const parseMediaComponent = (document, MEDIA_TYPE) => {
  const { template: { components = [] } = {} } = document || {}
  const elementList = components
    .filter(({ type }) => type === HEADER_TYPE)
    .flatMap(component => component[PARAMETERS_PROPERTY])
    .filter(({ type }) => type.indexOf(MEDIA_TYPE) !== -1)
    .flatMap(parameter => parameter)
    .map((element) => ({
      ...element,
      uri: element[MEDIA_TYPE].link,
      authorizationRealm: 'blip',
      type: element.type || MEDIA_TYPE
    }))

  return elementList[0]
}

export const parseComponentImage = (document) => {
  return parseMediaComponent(document, MEDIA_TYPE.IMAGE)
}

export const parseComponentVideo = (document) => {
  return parseMediaComponent(document, MEDIA_TYPE.VIDEO)
}

export const parseComponentDocument = (document) => {
  const { template: { components = [] } = {} } = document || {}
  const elementList = components
    .filter(({ type }) => type === HEADER_TYPE)
    .flatMap(component => component[PARAMETERS_PROPERTY])
    .filter(({ type }) => type.indexOf(MEDIA_TYPE.DOCUMENT) !== -1)

  return elementList[0]
    ? {
      ...elementList[0],
      uri: elementList[0].document.link,
      title: elementList[0].document.filename
    }
    : undefined
}

export const parseComponentAudio = (document) => {
  return parseMediaComponent(document, MEDIA_TYPE.AUDIO)
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
