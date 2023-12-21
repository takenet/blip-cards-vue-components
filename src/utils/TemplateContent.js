const COMPONENT_BUTTONS_TYPE = 'BUTTONS'
const BUTTONS_PROPERTY = 'buttons'
const PARAMETERS_PROPERTY = 'parameters'
const HEADER_TYPE = 'header'
const IMAGE_TYPE = 'image'

export const BUTTON_TYPE = {
  PHONE_NUMBER: 'PHONE_NUMBER',
  QUICK_REPLY: 'QUICK_REPLY',
  URL: 'URL'
}

export const MEDIA_TYPE = {
  IMAGE: 'image'
}

export const parseComponentImage = (document) => {
  const { template: { components = [] } = {} } = document || {}

  const image = components
    .filter(({ type }) => type === HEADER_TYPE)
    .flatMap(component => component[PARAMETERS_PROPERTY])
    .filter(({ type }) => type === IMAGE_TYPE)
    .flatMap(parameter => parameter[MEDIA_TYPE.IMAGE])
    .map((image) => ({
      uri: image.link,
      authorizationRealm: 'blip',
      type: 'image'
    }))

  return image[0]
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
