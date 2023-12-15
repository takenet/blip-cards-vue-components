const COMPONENT_BUTTONS_TYPE = 'BUTTONS'
const BUTTONS_PROPERTY = 'buttons'

const BUTTON_TYPE = {
  PHONE_NUMBER: 'PHONE_NUMBER',
  QUICK_REPLY: 'QUICK_REPLY',
  URL: 'URL'
}

export const parseComponentButtons = (document) => {
  const { templateContent: { components = [] } = {} } = document || {}

  return components
    .filter(({ type }) => type === COMPONENT_BUTTONS_TYPE)
    .flatMap(component => component[BUTTONS_PROPERTY])
    .reduce((acc, button) => {
      acc.exists = true

      switch (button.type) {
        case BUTTON_TYPE.PHONE_NUMBER:
          acc.buttons.phoneNumber = button
          break
        case BUTTON_TYPE.QUICK_REPLY:
          acc.buttons.quickReplies.push(button)
          break
        case BUTTON_TYPE.URL:
          acc.buttons.website = button
          break
        default:
          break
      }

      return acc
    }, {
      exists: false,
      buttons: {
        website: undefined,
        phoneNumber: undefined,
        quickReplies: []
      }
    })
}
