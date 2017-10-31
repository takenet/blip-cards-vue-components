import PlainText from './components/PlainText'

function install (Vue) {
  Vue.component('plain-text', PlainText)
}

export {
    PlainText,
    install
}

export default install
