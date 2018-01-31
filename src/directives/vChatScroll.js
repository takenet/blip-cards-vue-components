/**
 * @name VueJS vChatScroll (vue-chat-scroll)
 * @description Monitors an element and scrolls to the bottom if a new child is added
 * @author Theodore Messinezis <theo@theomessin.com>
 * @file v-chat-scroll  directive definition
 */

;(function(w, d) {
  var raf =
    w.requestAnimationFrame ||
    w.setImmediate ||
    function(c) {
      return setTimeout(c, 0)
    }

  function initEl(el) {
    if (Object.prototype.hasOwnProperty.call(el, 'data-simple-scrollbar')) {
      return
    }

    Object.defineProperty(el, 'data-simple-scrollbar', new Ss(el))
  }

  // Mouse drag handler
  function dragDealer(el, context) {
    var lastPageY

    el.addEventListener('mousedown', function(e) {
      lastPageY = e.pageY
      el.classList.add('ss-grabbed')
      d.body.classList.add('ss-grabbed')

      d.addEventListener('mousemove', drag)
      d.addEventListener('mouseup', stop)

      return false
    })

    function drag(e) {
      var delta = e.pageY - lastPageY
      lastPageY = e.pageY

      raf(function() {
        context.el.scrollTop += delta / context.scrollRatio
      })
    }

    function stop() {
      el.classList.remove('ss-grabbed')
      d.body.classList.remove('ss-grabbed')
      d.removeEventListener('mousemove', drag)
      d.removeEventListener('mouseup', stop)
    }
  }

  // Constructor
  function Ss(el) {
    this.target = el

    this.direction = w.getComputedStyle(this.target).direction

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

    w.addEventListener('resize', this.moveBar.bind(this))
    this.el.addEventListener('scroll', this.moveBar.bind(this))
    this.el.addEventListener('mouseenter', this.moveBar.bind(this))

    this.target.classList.add('ss-container')

    var css = w.getComputedStyle(el)
    if (css['height'] === '0px' && css['max-height'] !== '0px') {
      el.style.height = css['max-height']
    }
  }

  Ss.prototype = {
    moveBar: function(e) {
      var totalHeight = this.el.scrollHeight
      var ownHeight = this.el.clientHeight
      var _this = this

      this.scrollRatio = ownHeight / totalHeight

      var isRtl = _this.direction === 'rtl'
      var right = isRtl
        ? _this.target.clientWidth - _this.bar.clientWidth + 18
        : (_this.target.clientWidth - _this.bar.clientWidth) * -1

      raf(function() {
        // Hide scrollbar if no scrolling is possible
        if (_this.scrollRatio >= 1) {
          _this.bar.classList.add('ss-hidden')
        } else {
          _this.bar.classList.remove('ss-hidden')
          _this.bar.style.cssText =
            'height:' +
            Math.max(_this.scrollRatio * 100, 10) +
            '%; top:' +
            _this.el.scrollTop / totalHeight * 100 +
            '%;right:' +
            right +
            'px;'
        }
      })
    }
  }

  Ss.initEl = initEl

  w.SimpleScrollbar = Ss
})(window, document)

const scrollToBottom = (el) => {
  setTimeout(() => {
    el.scrollTop = el.scrollHeight
  }, 200)
}

const scrollToTop = (el) => {
  el.scrollTop = 0
}

const scroll = (el, binding) => {
  let config = binding.value || {}
  let contentScroll = el.querySelector('.ss-content')
  scrolled = contentScroll.scrollTop === contentScroll.scrollHeight
  if (config.always !== true && scrolled) {
    return
  }

  if (config.scrollToTop) {
    scrollToTop(contentScroll)
  } else {
    scrollToBottom(contentScroll)
  }
}

let scrolled = false

const vChatScroll = {
  bind: (el, binding) => {
    window.SimpleScrollbar.initEl(el)

    let contentScroll = el.querySelector('.ss-content')
    let timeout

    let config = binding.value || {}

    contentScroll.addEventListener('scroll', (e) => {
      if (timeout) window.clearTimeout(timeout)
      timeout = window.setTimeout(function() {
        if (config.scrollToTop) {
          scrolled = contentScroll.scrollTop > 0
        } else {
          scrolled =
            contentScroll.scrollTop + contentScroll.clientHeight + 1 <
            contentScroll.scrollHeight
        }
      }, 200)
    })

    new MutationObserver((e) => {
      if (e[e.length - 1].addedNodes.length !== 1) return

      // Infinite scroll, new elements are added so we haveto keep the scroll in the same position
      if (config.scrollToTop !== true && contentScroll.scrollTop === 0) {
        let addedHeight = 0
        for (let item of e) {
          addedHeight += item.addedNodes[0].scrollHeight
        }
        contentScroll.scrollTop = addedHeight
      } else {
        scroll(el, binding)
      }
    }).observe(contentScroll, { childList: true, subtree: true })
  },
  inserted: (el, binding) => {
    scrolled = false
    scroll(el, binding)
  }
}

export default vChatScroll
