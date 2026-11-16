// Locks that [label](signed media link) anchors can never be reached by the generic URL/www/e-mail
// patterns of linkify (stored XSS: a www link swallowed the file anchor into its href), and that text
// without such links is linkified exactly as before.
import { Parser } from 'htmlparser2'
import { linkify } from '../../../src/utils/misc'

// PlainText runs linkify on the output of the library sanitize mixin in escape mode. The mixin does
// `import * as sanitize from 'sanitize-html'`, which is only callable under webpack; flag the module as
// ES so babel hands the function itself to the mixin, as webpack does.
const loadLibrarySanitize = () => {
  const sanitizeHtml = require('sanitize-html')
  const mixinPath = require.resolve('../../../src/mixins/sanitizeHtml')
  delete require.cache[mixinPath]
  sanitizeHtml.__esModule = true
  try {
    return require(mixinPath).default.mixin
  } finally {
    delete sanitizeHtml.__esModule
    delete require.cache[mixinPath]
  }
}
const sanitize = loadLibrarySanitize()
const escapeSanitize = (text) => sanitize(text, { disallowedTagsMode: 'escape' })

const elements = (html) => {
  const found = []
  const parser = new Parser({ onopentag: (name, attribs) => found.push({ name, attribs }) }, { decodeEntities: true })
  parser.write(html)
  parser.end()
  return found
}

const expectOnlyLinkAttributes = (html) => {
  const found = elements(html)
  found.forEach(({ name, attribs }) => {
    expect(name, html).to.equal('a')
    Object.keys(attribs).forEach(attribute => expect(['href', 'target', 'rel'], html).to.include(attribute))
    expect(attribs.href, html).to.not.match(/[<>]/)
  })
  return found
}

const signed = 'https://hmgmsgingmedia.blob.core.windows.net/media/x/boleto.pdf?sv=2021-08-06&amp;se=2026-11-16T14%3A11%3A00Z&amp;sr=b&amp;sp=r&amp;sig=abc'
const fileAnchor = (label, uri = signed) => `<a href="${uri}" target="_blank" rel="noopener noreferrer">${label}</a>`

// linkify as released with the named media links (13c6bf7), kept as the reference for unchanged output.
function previousLinkify(inputText, disableLink) {
  if (!inputText) {
    return ''
  }
  if (/href\s*=/i.test(inputText)) {
    return inputText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }
  if (disableLink) {
    return inputText
  }
  // eslint-disable-next-line no-useless-escape
  const urlValidPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim
  const pseudoUrlValidPattern = /(^|[^/])(www\.[\S]+(\b|$))/gim
  const emailAddressValidPattern = /[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim
  const namedMediaLinkPattern = /\[([^[\]\r\n]{1,200})\]\((https?:\/\/[^\s()"'<>]+)\)/g
  const isSignedMediaUri = (uri) => /[?&;]se=/.test(uri) && /[?&;]sig=/.test(uri)
  const anchors = []
  const withNamedLinks = inputText.replace(namedMediaLinkPattern, (match, label, uri) => {
    if (!isSignedMediaUri(uri) || /:\/\/|www\./i.test(label) || /[<>"]/.test(label)) {
      return match
    }
    anchors.push(`<a href="${uri}" target="_blank" rel="noopener noreferrer">${label}</a>`)
    return `\u0001${anchors.length - 1}\u0001`
  })
  return withNamedLinks
    .replace(urlValidPattern, '<a href="$&" target="_blank">$&</a>')
    .replace(pseudoUrlValidPattern, '$1<a href="https://$2" target="_blank">$2</a>')
    .replace(emailAddressValidPattern, '<a href="mailto:$&" target="_blank">$&</a>')
    .replace(/\u0001(\d+)\u0001/g, (match, index) => anchors[Number(index)])
}

describe('linkify security (named media links)', () => {
  const payload = 'www.evil.com[f.pdf](https://h/onmouseover=alert`1`//?se=1&sig=2)z'

  it('reference implementation reproduces the vulnerability (guards this spec)', () => {
    const attributes = elements(previousLinkify(escapeSanitize(payload)))
      .reduce((all, { attribs }) => all.concat(Object.keys(attribs)), [])
    expect(attributes).to.include('onmouseover')
  })

  const variants = {
    raw: payload,
    'after the library sanitize (escape mode)': escapeSanitize(payload)
  }
  Object.keys(variants).forEach(variant => {
    it(`keeps the file anchor out of a www link: ${variant}`, () => {
      const html = linkify(variants[variant])
      const anchors = expectOnlyLinkAttributes(html)
      expect(anchors).to.have.length(2)
      expect(anchors[0].attribs.href).to.equal('https://www.evil.com')
      expect(anchors[0].attribs.href).to.not.include('<a')
      expect(anchors[1].attribs.rel).to.equal('noopener noreferrer')
      expect(html).to.match(/>f\.pdf<\/a>z$/)
    })
  })

  it('www link right before a named link and text after it', () => {
    const text = escapeSanitize('www.x[f](https://h/a?se=1&sig=2)a')
    const html = linkify(text)
    expectOnlyLinkAttributes(html)
    expect(html).to.equal(
      '<a href="https://www.x" target="_blank">www.x</a>' + fileAnchor('f', 'https://h/a?se=1&amp;sig=2') + 'a'
    )
  })

  it('http link and named link side by side', () => {
    const html = linkify(`http://a.com/x[boleto.pdf](${signed})http://b.com`)
    expectOnlyLinkAttributes(html)
    expect(html).to.equal(
      '<a href="http://a.com/x" target="_blank">http://a.com/x</a>' +
      fileAnchor('boleto.pdf') +
      '<a href="http://b.com" target="_blank">http://b.com</a>'
    )
  })

  it('e-mail addresses next to a named link', () => {
    const html = linkify(`joe@mail.com[boleto.pdf](${signed})ann@x.com.br`)
    expectOnlyLinkAttributes(html)
    expect(html).to.equal(
      '<a href="mailto:joe@mail.com" target="_blank">joe@mail.com</a>' +
      fileAnchor('boleto.pdf') +
      '<a href="mailto:ann@x.com.br" target="_blank">ann@x.com.br</a>'
    )
  })

  it('quotes in the label or in the address stay inside the anchor', () => {
    const text = '[a" onmouseover=x](https://h/a?se=1&sig=2) [f](https://h/a?se=1&sig=2&quot;onclick=x//)'
    ;[text, escapeSanitize(text)].forEach(variant => {
      const html = linkify(variant)
      expectOnlyLinkAttributes(html)
      expect(html).to.not.include('rel="noopener noreferrer">a')
    })
  })

  // Only the file anchor is checked here.
  it('does not write a file anchor inside a tag', () => {
    const html = linkify(escapeSanitize('<a name="x[f](https://h/a?se=1&sig=2)">hi</a>'))
    expect(html).to.not.include('rel="noopener noreferrer"')
  })

  it('keeps the output of a signed media link', () => {
    const text = `Arquivo: [boleto.pdf](${signed}), [nota fiscal.pdf](${signed})\nObs: <b>ok</b>`
    expect(linkify(text)).to.equal(
      `Arquivo: ${fileAnchor('boleto.pdf')}, ${fileAnchor('nota fiscal.pdf')}\nObs: <b>ok</b>`
    )
    expect(linkify(text)).to.equal(previousLinkify(text))
    expect(linkify(escapeSanitize(text))).to.equal(previousLinkify(escapeSanitize(text)))
  })

  describe('text without named media links is linkified exactly as before', () => {
    const texts = [
      '',
      null,
      undefined,
      'just some text',
      'http://example.com',
      'see https://example.com/path?a=1&b=2#frag, and ftp://files.example.com/x.zip.',
      'www.example.com',
      '(www.example.com/page) and www.other.org.',
      'go to http://www.example.com now',
      'mail joe.doe@example.com or ann-x@sub.example.co.uk',
      'mixed: https://a.com www.b.com c@d.com\nwww.e.com\nhttp://f.com/www.g.com',
      'www.a.comhttps://b.com/x',
      'www.a.com(https://b.com/x)',
      '<b>bold</b> www.example.com <i>http://x.com</i>',
      '<a href="http://x.com">x</a>',
      '[not signed](https://example.com/file.pdf)',
      '[www.label.com](https://h/a?se=1&amp;sig=2)',
      '[a <b>](https://h/a?se=1&amp;sig=2)',
      'é www.ação.com.br ç',
      '\u0001 0 \u0001 www.x.com',
      'a < b www.x.com and 3 <4 http://x.com',
      'x > y mail@x.com, a <= b, << www.x.com >>',
      'see www.a.com/x?y=1&z=2 or ftp://f.io/a.zip;\r\nbye joe@x.com.'
    ]
    texts.forEach(text => {
      it(String(JSON.stringify(text)), () => {
        expect(linkify(text)).to.equal(previousLinkify(text))
        expect(linkify(text, true)).to.equal(previousLinkify(text, true))
        if (typeof text === 'string') {
          const sanitized = escapeSanitize(text)
          expect(linkify(sanitized)).to.equal(previousLinkify(sanitized))
        }
      })
    })
  })
})

// Locks that the URL/www/e-mail patterns never run inside a tag (stored XSS: an address written in an
// attribute value of a tag kept by the sanitize became an anchor inside that value, and the rest of the
// address added event handler attributes to the tag), while the text between tags is linkified as before.
describe('linkify security (links inside tags)', () => {
  const payloads = [
    '<a name="http://x/onmouseover=location=/javascript:alert%281%29/.source//">hi</a>',
    '<a target="www.x.com/onmouseover=alert`1`//">x</a>'
  ]
  const attributeNames = (html) => elements(html).reduce((all, { attribs }) => all.concat(Object.keys(attribs)), [])
  const isLinkAnchor = ({ name, attribs }) =>
    name === 'a' && 'href' in attribs && Object.keys(attribs).every(attribute => ['href', 'target', 'rel'].includes(attribute))

  // Every element is one of the input (same attributes) or an anchor with only href/target/rel, and no
  // attribute is an event handler or carries an anchor in its value.
  const expectTagsKept = (text, html) => {
    const original = elements(text).map(element => JSON.stringify(element))
    const found = elements(html)
    found.forEach(element => {
      expect(isLinkAnchor(element) || original.includes(JSON.stringify(element)), html).to.equal(true)
      Object.keys(element.attribs).forEach(attribute => {
        expect(attribute, html).to.not.match(/^on/i)
        expect(element.attribs[attribute], html).to.not.match(/<a/i)
      })
    })
    return found.filter(isLinkAnchor)
  }

  payloads.forEach(payload => {
    it(`reference implementation reproduces the vulnerability (guards this spec): ${payload}`, () => {
      expect(attributeNames(previousLinkify(escapeSanitize(payload)))).to.include('onmouseover')
      expect(attributeNames(previousLinkify(payload))).to.include('onmouseover')
    })

    const variants = { raw: payload, 'after the library sanitize (escape mode)': escapeSanitize(payload) }
    Object.keys(variants).forEach(variant => {
      it(`does not link inside the attributes of a tag: ${variant}: ${payload}`, () => {
        const text = variants[variant]
        const html = linkify(text)
        expect(html).to.equal(text)
        expect(attributeNames(html)).to.not.include('onmouseover')
        expect(expectTagsKept(text, html)).to.have.length(0)
      })
    })

    it(`still links the text around and inside the tag: ${payload}`, () => {
      const text = escapeSanitize(`see www.ok.com ${payload.replace('</a>', ' http://y.com</a>')} joe@x.com`)
      const html = linkify(text)
      const anchors = expectTagsKept(text, html)
      expect(anchors.map(anchor => anchor.attribs.href)).to.deep.equal(['https://www.ok.com', 'http://y.com', 'mailto:joe@x.com'])
      expect(html.indexOf(text.slice(text.indexOf('<a '), text.indexOf('>') + 1))).to.not.equal(-1)
    })
  })

  // Raw text (callers that sanitize afterwards): tags are read with the quoting rules of the browser.
  describe('reads tags as the browser does', () => {
    const texts = [
      '<a name="x>http://y/onmouseover=alert(1)//">hi</a>',
      "<a name='x>www.y.com/onmouseover=alert(1)//'>hi</a>",
      '<a name="a"=" title="x>www.y.com/onmouseover=alert(1)//">hi</a>',
      '<a name=http://y/onmouseover=alert(1)//>hi</a>',
      '<a name\u00a0="x>www.y.com/onmouseover=alert(1)//">hi</a>',
      '<A\nNAME = "x>www.y.com/onmouseover=alert(1)//">hi</A>',
      '<a/name="x>www.y.com/onmouseover=alert(1)//">hi</a>',
      '<a name="www.y.com/onmouseover=alert(1)//',
      '<!-- x > www.y.com/x" onmouseover="alert(1) -->',
      '<a name="x>[f](https://h/a?se=1&sig=2)">hi</a>'
    ]
    texts.forEach(text => {
      it(String(JSON.stringify(text)), () => {
        const html = linkify(text)
        expect(html).to.equal(text)
        expectTagsKept(text, html)
      })
    })
  })

  describe('benign text with tags is linkified exactly as before', () => {
    const texts = [
      '<b>bold</b> http://x.com <i>italic www.y.com </i>',
      '<p>mail: joe@x.com</p><p>site: https://x.com/a?b=1</p>',
      'line 1<br>www.x.com and http://y.com<br/>z@w.com<br />end',
      '<ul><li>http://a.com</li><li>www.b.com and more</li><li>c@d.com</li></ul>',
      '<strong>ok</strong> <em>http://x.com</em> <u>a@b.com</u>',
      '<p>see www.x.com, http://y.com/x and joe@mail.com.</p>',
      'text <i>http://x.com/www.y.com</i> <b>www.z.com/path </b>.',
      '<div>http://x.com</div><div>mail@y.com</div>',
      '<p>\nwww.x.com\n</p>',
      '<a name="n">see http://x.com</a> <a target="_blank">joe@x.com</a>',
      `<b>Arquivo:</b> [boleto.pdf](${signed}) <i>www.x.com </i>`
    ]
    texts.forEach(text => {
      it(String(JSON.stringify(text)), () => {
        expect(linkify(text)).to.equal(previousLinkify(text))
        expect(linkify(text, true)).to.equal(previousLinkify(text, true))
        const sanitized = escapeSanitize(text)
        expect(linkify(sanitized)).to.equal(previousLinkify(sanitized))
      })
    })
  })

  // The www pattern used to run into the tag right after the address and write it inside the href
  // (e.g. href="https://www.x.com</b>"); the address now ends where the tag starts.
  describe('a www address right before a tag ends at the tag', () => {
    const www = (address) => `<a href="https://${address}" target="_blank">${address}</a>`
    const cases = {
      '<b>www.x.com</b>': `<b>${www('www.x.com')}</b>`,
      '<p>www.x.com/path?a=1</p> ok': `<p>${www('www.x.com/path?a=1')}</p> ok`,
      'line<br />www.x.com<br />http://y.com': `line<br />${www('www.x.com')}<br /><a href="http://y.com" target="_blank">http://y.com</a>`
    }
    Object.keys(cases).forEach(text => {
      it(String(JSON.stringify(text)), () => {
        expect(escapeSanitize(text)).to.equal(text)
        expect(linkify(text)).to.equal(cases[text])
        expect(previousLinkify(text)).to.not.equal(cases[text])
      })
    })
  })
})
