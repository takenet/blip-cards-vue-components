import PlainText from './components/PlainText'

function install(Vue) {
  let components = []
  components.push({ name: 'plainText', component: Vue.component('plain-text', PlainText) })
  return components
}

export {
  PlainText,
  install
}

export default install
