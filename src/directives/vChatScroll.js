import debounce from 'lodash/debounce'

/**
 * @name VueJS vChatScroll (vue-chat-scroll)
 * @description Monitors an element and scrolls to the bottom if a new child is added
 * @author Theodore Messinezis <theo@theomessin.com>
 * @file v-chat-scroll  directive definition
 */
;(function(w, d) {
  const raf =
    w.requestAnimationFrame ||
    w.setImmediate ||
    function(c) {
      return setTimeout(c, 0)
    }

  function initEl(el) {
    if (Object.prototype.hasOwnProperty.call(el, 'data-simple-scrollbar')) {
      return
    }

    Object.defineProperty(el, 'data-simple-scrollbar', {
      value: new Ss(el),
      configurable: true
    })
  }

  function unbindEl(el) {
    if (!Object.prototype.hasOwnProperty.call(el, 'data-simple-scrollbar')) return
    el['data-simple-scrollbar'].unBind()
    delete el['data-simple-scrollbar']
  }

  // Mouse drag handler
  function dragDealer(el, context) {
    let lastPageY

    const onMouseDown = function(e) {
      lastPageY = e.pageY
      el.classList.add('ss-grabbed')
      d.body.classList.add('ss-grabbed')

      d.addEventListener('mousemove', drag)
      d.addEventListener('mouseup', stop)

      return false
    }

    el.addEventListener('mousedown', onMouseDown)

    function drag(e) {
      const delta = e.pageY - lastPageY
      lastPageY = e.pageY

      raf(function() {
        context.el.scrollTop += delta / context.scrollRatio
      })
    }

    function stop() {
      el.removeEventListener('mousedown', onMouseDown)

      el.classList.remove('ss-grabbed')
      d.body.classList.remove('ss-grabbed')
      d.removeEventListener('mousemove', drag)
      d.removeEventListener('mouseup', stop)
    }
  }

  // Constructor
  function Ss(el) {
    this.target = el
    this.content = el.firstElementChild
    this.direction = w.getComputedStyle(this.target).direction

    // Create a reference to the function binding to remove the event listeners
    this.mB = this.moveBar.bind(this)

    this.bar = '<div class="ss-scroll">'

    this.wrapper = d.createElement('div')
    this.wrapper.setAttribute('class', 'ss-wrapper')

    this.el = d.createElement('div')
    this.el.setAttribute('class', 'ss-content')

    if (this.direction === 'rtl') {
      this.el.classList.add('rtl')
    }

    this.wrapper.appendChild(this.el)

    while (this.target.firstChild) {
      this.el.appendChild(this.target.firstChild)
    }
    this.target.appendChild(this.wrapper)

    this.target.insertAdjacentHTML('beforeend', this.bar)
    this.bar = this.target.lastChild

    dragDealer(this.bar, this)
    this.moveBar()

    // Stay at bottom if element is at bottom during resize
    this.resizeFunction = () => {
      if (this.el.scrollTop + this.currentHeight >= this.el.scrollHeight) {
        scrollToBottom(this.el)
      }
      this.currentHeight = this.el.clientHeight
      setTimeout(this.mB, 100)
    }

    w.addEventListener('resize', this.resizeFunction)
    this.el.addEventListener('scroll', this.mB)
    this.el.addEventListener('mouseenter', this.mB)
    this.el.addEventListener('onMutation', this.mB)

    this.target.classList.add('ss-container')

    const css = w.getComputedStyle(el)
    if (css['height'] === '0px' && css['max-height'] !== '0px') {
      el.style.height = css['max-height']
    }

    this.unBind = function() {
      // Remove event listeners
      w.removeEventListener('resize', this.resizeFunction)
      this.el.removeEventListener('scroll', this.mB)
      this.el.removeEventListener('mouseenter', this.mB)
      this.el.removeEventListener('onMutation', this.mB)

      this.target.classList.remove('ss-container')

      // Unwrap the initial content and remove remaining wrappers
      this.target.insertBefore(this.content, this.wrapper)
      this.target.removeChild(this.wrapper)

      // Remove the bar including its drag-dealer event listener
      this.target.removeChild(this.bar)
      this.bar = null // make way for the garbage collector
    }
  }

  Ss.prototype = {
    moveBar: function(e) {
      const totalHeight = this.el.scrollHeight
      const ownHeight = this.el.clientHeight
      const _this = this
      this.currentHeight = this.el.clientHeight

      this.scrollRatio = ownHeight / totalHeight

      const isRtl = _this.direction === 'rtl'
      const right = isRtl
        ? _this.target.clientWidth - _this.bar.clientWidth + 18
        : (_this.target.clientWidth - _this.bar.clientWidth) * -1

      raf(function() {
        // const maximumTop = 90
        let top = _this.el.scrollTop / totalHeight * 100
        // top = top > maximumTop ? maximumTop : top

        // Hide scrollbar if no scrolling is possible
        if (_this.scrollRatio >= 1) {
          _this.bar.classList.add('ss-hidden')
        } else {
          _this.bar.classList.remove('ss-hidden')
          _this.bar.style.cssText =
            'height:' +
            Math.max(_this.scrollRatio * 100, 0.5) +
            '%; top:' +
            top +
            '%;right:' +
            right +
            'px;'
        }
      })
    }
  }

  Ss.initEl = initEl
  Ss.unbindEl = unbindEl

  w.SimpleScrollbar = Ss
})(window, document)

const scrollToBottom = (el) => {
  el.scrollTop = el.scrollHeight
}

const scrollToTop = (el) => {
  el.scrollTop = 0
}

const scroll = (el, binding) => {
  let config = binding.value || {}

  if (config.always !== true && config.scrolled) {
    return
  }

  if (config.scrollToTop) {
    scrollToTop(el)
  } else {
    scrollToBottom(el)
  }
}

const vChatScroll = {
  bind: (el, binding) => {
    window.SimpleScrollbar.initEl(el)
    let contentScroll = el.querySelector('.ss-content')
    let config = binding.value || {}
    el.previousContentHeight = 0

    contentScroll.addEventListener('force-scroll', (e) => {
      config.scrolled = false
      scroll(contentScroll, binding)
    })

    if (config.onScroll) {
      contentScroll.addEventListener('scroll', config.onScroll)
    }

    let scrollEvent = debounce(() => {
      const scrollTop = contentScroll.scrollTop || contentScroll.scrollY || 0

      if (config.scrollToTop) {
        config.scrolled = scrollTop > 0
      } else {
        // there is a 2 pixels threshold when content is not scrolled
        config.scrolled = (contentScroll.scrollHeight - scrollTop) - contentScroll.clientHeight > 2
      }
    }, 100)

    contentScroll.addEventListener('scroll', (e) => {
      scrollEvent()
    })

    config.mutationObserver = new MutationObserver((e) => {
      if (!e.find((x) => x.addedNodes.length > 0)) return

      const previousContentHeight = el.previousContentHeight
      el.previousContentHeight = contentScroll.scrollHeight

      // Bug correction for new chat scroll arrow behaviour
      // In case there is no more information to load on infinite loading ($state.complete())
      // Or we want to prevent any scroll updates on mutation, we pass { updateOnMutation: false }
      // Ignoring mutation will only happen when user has scrolled
      if (el.shouldScrollOnMutation === false && config.scrolled === true) {
        contentScroll.dispatchEvent(new Event('onMutation'))
        return
      }

      const scrollTop = contentScroll.scrollTop || contentScroll.scrollY || 0

      // Infinite scroll, new elements are added so we have to keep the scroll in the same position
      if (config.scrollToTop !== true && scrollTop === 0) {
        contentScroll.scrollTop = contentScroll.scrollHeight - previousContentHeight
      } else {
        scroll(contentScroll, binding)
      }

      contentScroll.dispatchEvent(new Event('onMutation'))
    })

    config.mutationObserver.observe(contentScroll, {
      childList: true,
      subtree: true
    })
  },
  update: (el, binding) => {
    let config = binding.value || {}
    el.shouldScrollOnMutation = config.updateOnMutation !== false
  },
  inserted: (el, binding) => {
    let config = binding.value || {}
    config.scrolled = false
    let contentScroll = el.querySelector('.ss-content')
    el.previousContentHeight = contentScroll.scrollHeight
    scroll(contentScroll, binding)
  },
  unbind: (el, binding) => {
    let config = binding.value || {}
    if (config.mutationObserver) {
      config.mutationObserver.disconnect()
    }
    window.SimpleScrollbar.unbindEl(el)

    let contentScroll = el.querySelector('.ss-content')
    if (config.onScroll && contentScroll) {
      contentScroll.removeEventListener('scroll', config.onScroll)
    }
  }
}

export default vChatScroll
