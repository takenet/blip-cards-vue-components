export default {
  bind: (el) => {
    el.setAttribute('rows', '1')
    el.style.overflow = 'hidden'
  },
  update: (el) => {
    el.style.height = 'auto'
    el.style['min-height'] = 'auto'
    el.style.height = `${el.scrollHeight + 2}px`
  }
}
