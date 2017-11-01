import PlainText from './components/PlainText'
import MediaLink from './components/MediaLink'

function install(Vue) {
  let components = []
  components.push(
    { name: 'plainText', component: Vue.component('plain-text', PlainText) },
    { name: 'mediaLink', component: Vue.component('media-link', MediaLink) }
  )
  return components
}

export {
  PlainText,
  MediaLink,
  install
}

export default install
