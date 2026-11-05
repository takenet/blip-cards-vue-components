// Locks that the optional `translation` prop changes nothing unless the host passes `enabled: true`.
import { renderVNode, findAll, walk, serialize, isTranslationNode } from '../helpers/vueSfc'
import PlainText from '../../../src/components/PlainText.vue'
import BlipSelect from '../../../src/components/BlipSelect.vue'
import MediaLink from '../../../src/components/MediaLink.vue'
import ReplyCard from '../../../src/components/ReplyCard/ReplyCard.vue'
import BlipCard from '../../../src/components/BlipCard.vue'
import BlipCardDate from '../../../src/components/BlipCardDate.vue'
import BlipGroupCard from '../../../src/components/BlipGroupCard.vue'

const calls = { count: 0 }
const spy = () => {
  calls.count++
  return null
}
const withCallbacks = (translation) => Object.assign({ getTranslation: spy, onTranslate: spy, canTranslate: spy }, translation)

// Every shape a host could send while the feature is off.
const inactiveShapes = {
  'absent (undefined)': () => undefined,
  'null': () => null,
  '{ enabled: false }': () => withCallbacks({ enabled: false, showOriginal: true }),
  '{} (no enabled flag)': () => withCallbacks({}),
  '{ enabled: "true" } (not the boolean)': () => withCallbacks({ enabled: 'true' }),
  '{ enabled: 1 } (not the boolean)': () => withCallbacks({ enabled: 1 })
}
const enabled = () => ({ enabled: true, onTranslate: () => {} })

// guid() ids are random; fix them so two renders can be compared.
const render = (component, props) => {
  const random = Math.random
  Math.random = () => 0.5
  try {
    return renderVNode(component, props)
  } finally {
    Math.random = random
  }
}

const textDocument = { id: 'msg-1', type: 'text/plain', content: 'Hello there' }
const imageDocument = { type: 'image/jpeg', uri: 'https://example.com/a.jpg', title: 'Title', text: 'Caption' }
const replyDocument = {
  replied: { type: 'text/plain', value: 'My answer' },
  inReplyTo: { id: 'q1', type: 'text/plain', value: 'The question', direction: 'received' }
}
const selectDocument = { text: 'Pick one', scope: 'immediate', options: [{ text: 'A' }, { text: 'B', description: 'rich', badge: 'new' }] }

const isDateRow = (vnode) => vnode.tag === 'blip-card-date'
const isSelectNotification = (vnode) => vnode.tag === 'div' && JSON.stringify((vnode.data && vnode.data.class) || '').indexOf('notification') !== -1

// Cards that render the translation footer next to their date row.
// `rowAfterBubble` is the element that follows the bubble, where the footer row would go.
const cards = [
  {
    name: 'PlainText',
    component: PlainText,
    rowAfterBubble: isDateRow,
    props: (translation) => ({ document: 'Hello there', fullDocument: textDocument, position: 'left', date: '10:30', translation })
  },
  {
    name: 'BlipSelect (immediate)',
    component: BlipSelect,
    rowAfterBubble: isSelectNotification,
    props: (translation) => ({ document: selectDocument, fullDocument: { id: 's1', content: selectDocument }, position: 'left', date: '10:30', translation })
  },
  {
    name: 'MediaLink (image)',
    component: MediaLink,
    rowAfterBubble: isDateRow,
    props: (translation) => ({ document: imageDocument, fullDocument: { id: 'm1', content: imageDocument }, position: 'left', date: '10:30', translation })
  },
  {
    name: 'ReplyCard',
    component: ReplyCard,
    rowAfterBubble: isDateRow,
    props: (translation) => ({
      document: replyDocument,
      fullDocument: { id: 'r1', direction: 'received', content: replyDocument },
      position: 'left',
      date: '10:30',
      translation
    })
  }
]

describe('translation zero impact', () => {
  cards.forEach(({ name, component, rowAfterBubble, props }) => {
    describe(name, () => {
      const baseline = () => render(component, props(undefined)).vnode

      Object.keys(inactiveShapes).forEach((shape) => {
        describe(`translation ${shape}`, () => {
          let vm
          let vnode

          before(() => {
            calls.count = 0
            ;({ vm, vnode } = render(component, props(inactiveShapes[shape]())))
          })

          it('renders the same virtual nodes as without the prop', () => {
            expect(serialize(vnode)).to.deep.equal(serialize(baseline()))
          })

          it('renders no translation node', () => {
            expect(findAll(vnode, isTranslationNode)).to.have.lengthOf(0)
            expect(vm.translationState).to.equal('none')
            expect(vm.translationRowFooter).to.have.lengthOf(0)
            expect(vm.translationDateFooter).to.have.lengthOf(0)
          })

          it('leaves nothing in the date row nor between the bubble and it', () => {
            const dates = findAll(vnode, isDateRow)
            expect(dates).to.have.lengthOf(1)
            expect(dates[0].children || []).to.have.lengthOf(0)

            const [row] = findAll(vnode, rowAfterBubble)
            walk(vnode, (node, parent) => {
              if (node === row) {
                const previous = parent.children[parent.children.indexOf(node) - 1]
                expect(previous.isComment, 'placeholder comment before the date row').to.equal(false)
              }
            })
          })

          it('does not call the translation callbacks', () => {
            expect(calls.count).to.equal(0)
          })
        })
      })

      it('renders the translation control when enabled (the checks above can fail)', () => {
        const { vnode } = render(component, props(enabled()))
        expect(findAll(vnode, isTranslationNode).length).to.be.above(0)
      })
    })
  })

  describe('BlipCard', () => {
    const forwardedTo = (vnode, tag) => findAll(vnode, (node) => node.tag === tag)[0].data.attrs

    Object.keys(inactiveShapes).forEach((shape) => {
      it(`only forwards the prop it received (${shape})`, () => {
        calls.count = 0
        const translation = inactiveShapes[shape]()
        const { vnode } = render(BlipCard, { document: textDocument, position: 'left', date: '10:30', translation })

        expect(forwardedTo(vnode, 'plain-text').translation).to.equal(translation)
        expect(findAll(vnode, isTranslationNode)).to.have.lengthOf(0)
        expect(calls.count).to.equal(0)
      })
    })
  })

  describe('BlipCardDate', () => {
    it('renders only its own content when the slot is empty', () => {
      const { vnode } = render(BlipCardDate, { date: '10:30', position: 'left' })
      const last = vnode.children[vnode.children.length - 1]

      expect(last.text).to.contain('10:30')
      expect(findAll(vnode, isTranslationNode)).to.have.lengthOf(0)
    })

    it('renders the slot content after the date', () => {
      const { vm } = render(BlipCardDate, { date: '10:30', position: 'left' })
      vm.$slots.default = [vm.$createElement('span', 'slot content')]

      const vnode = vm._render()
      expect(vnode.children[vnode.children.length - 1].tag).to.equal('span')
    })
  })

  describe('BlipGroupCard', () => {
    const documents = () => [
      { document: { id: 'a', type: 'text/plain', content: 'one' }, position: 'left', date: '09:00', status: 'read' },
      { document: { id: 'b', type: 'text/plain', content: 'two' }, position: 'left', date: '09:01', status: 'read' },
      { document: { id: 'c', type: 'text/plain', content: 'three' }, position: 'right', date: '09:02', status: 'dispatched' },
      { document: { id: 'd', type: 'text/plain', content: 'four' }, position: 'right', date: '09:03', status: 'failed' }
    ]
    const baseline = () => render(BlipGroupCard, { documents: documents() }).vnode

    Object.keys(inactiveShapes).forEach((shape) => {
      describe(`translation ${shape}`, () => {
        let vm
        let vnode

        before(() => {
          calls.count = 0
          ;({ vm, vnode } = render(BlipGroupCard, { documents: documents(), translation: inactiveShapes[shape]() }))
        })

        it('renders the same virtual nodes as without the prop', () => {
          // The only difference allowed is the prop each message receives.
          expect(serialize(vnode, ['translation'])).to.deep.equal(serialize(baseline(), ['translation']))
        })

        it('does not add the translation class or lift any footer', () => {
          expect(vnode.data.class['blip-group-card--translation']).to.equal(false)
          expect(vm.translationEnabled).to.equal(false)
          expect(vm.translationLiftedIds).to.deep.equal({})
          expect(findAll(vnode, isTranslationNode)).to.have.lengthOf(0)
        })

        it('renders nothing inside the group date rows', () => {
          const rows = findAll(vnode, isDateRow)
          expect(rows).to.have.lengthOf(2)
          rows.forEach((row) => expect(row.children || []).to.have.lengthOf(0))
        })

        it('does not call the translation callbacks', () => {
          expect(calls.count).to.equal(0)
        })
      })
    })

    it('lifts the footer of the last message of each group when enabled (the checks above can fail)', () => {
      const { vm, vnode } = render(BlipGroupCard, { documents: documents(), translation: enabled() })

      expect(vnode.data.class['blip-group-card--translation']).to.equal(true)
      expect(Object.keys(vm.translationLiftedIds).sort()).to.deep.equal(['b', 'd'])
    })
  })
})
