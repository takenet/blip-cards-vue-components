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

  if (!components) return undefined

  const elementList = components
    .filter(({ type }) => validateTextHasValue(type, HEADER_TYPE))
    .flatMap(component => component[PARAMETERS_PROPERTY])
    .filter(({ type }) => validateTextHasValue(type, MEDIA_TYPE))
    .flatMap(parameter => parameter)
    .map((element) => ({
      ...element,
      uri: element[MEDIA_TYPE].link,
      authorizationRealm: 'blip',
      type: element.type || MEDIA_TYPE
    }))

  let element
  if (elementList && elementList[0]) {
    element = elementList[0]
  }

  if (element && (!element.uri || element.uri === '')) {
    const header = components.filter(({ type }) => validateTextHasValue(type, HEADER_TYPE))

    if (header &&
      header[0] &&
      header[0].example &&
      header[0].example.header_handle) {
      element = {
        ...element,
        uri: header[0].example.header_handle[0]
      }
    }
  }

  return element
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
    .filter(({ type }) => validateTextHasValue(type, HEADER_TYPE))
    .flatMap(component => component[PARAMETERS_PROPERTY])
    .filter(({ type }) => validateTextHasValue(type, MEDIA_TYPE.DOCUMENT))

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
    .filter(({ type }) => validateTextHasValue(type, COMPONENT_BUTTONS_TYPE))
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

export const validateTextHasValue = (text, value) => {
  return (text || '').toLowerCase().includes(value)
}
