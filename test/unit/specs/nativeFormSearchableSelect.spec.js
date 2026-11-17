// `select` fields with `searchable: true` (list with a search box) and option fields whose options depend
// on the value of another field (`dependsOn` + `options` grouped by the parent value).
import Vue from 'vue'
import { renderVNode, findAll } from '../helpers/vueSfc'
import NativeForm from '../../../src/components/NativeForm.vue'

const createForm = (fields) => {
  const sent = []
  const { vm } = renderVNode(NativeForm, {
    document: { validation: { fields } },
    onSelected: (summary, message) => sent.push({ summary, content: message.content })
  })
  // Not mounted: submit only checks that the form exists
  vm.$refs.form = {}
  return { vm, sent }
}

const render = (vm) => {
  const previousIgnored = Vue.config.ignoredElements
  Vue.config.ignoredElements = [/-/]
  try {
    return vm._render()
  } finally {
    Vue.config.ignoredElements = previousIgnored
  }
}

const attrs = (vnode) => (vnode.data && vnode.data.attrs) || {}
const textOf = (vnode) => vnode.text !== undefined
  ? vnode.text
  : (vnode.children || []).map(textOf).join('')
const byField = (vm, id) => vm.formFields.find((field) => field.id === id)
const comboboxInput = (vnode) => findAll(vnode, (node) => node.tag === 'input' && attrs(node).role === 'combobox')[0]
const optionTexts = (vnode) => findAll(vnode, (node) => attrs(node).role === 'option').map((node) => textOf(node))

const type = (vm, id, text) => vm.onSearchInput(byField(vm, id), { target: { value: text } })
const key = (vm, id, name) => {
  const event = { key: name, defaultPrevented: false, preventDefault() { this.defaultPrevented = true } }
  vm.onComboboxKeydown(byField(vm, id), event)
  return event
}

const estado = {
  id: 'estado',
  label: 'Estado',
  type: 'select',
  required: true,
  searchable: true,
  options: [
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'SP', label: 'São Paulo' }
  ]
}

const cidade = (overrides) => Object.assign({
  id: 'cidade',
  label: 'Cidade',
  type: 'select',
  required: true,
  searchable: true,
  dependsOn: 'estado',
  options: {
    MT: [{ value: '5103403', label: 'Cuiabá' }, { value: '5108402', label: 'Várzea Grande' }],
    MS: [{ value: '5002704', label: 'Campo Grande' }, { value: '5003702', label: 'Dourados' }],
    SP: [{ value: '3509502', label: 'Campinas' }, { value: '3550308', label: 'São Paulo' }]
  }
}, overrides)

describe('NativeForm - searchable select and options that depend on another field', () => {
  let previousDocument

  before(() => {
    // focusField and the active option scroll look elements up by id
    previousDocument = global.document
    global.document = { getElementById: () => null }
  })

  after(() => {
    global.document = previousDocument
  })

  it('shows only the cities of the chosen state and lets the user type to filter them', () => {
    const { vm, sent } = createForm([estado, cidade()])

    let vnode = render(vm)
    const cityInput = findAll(vnode, (node) => attrs(node).id === vm.fieldInputId('cidade'))[0]
    expect(attrs(cityInput).disabled).to.equal(true)
    expect(vm.optionsNotice(byField(vm, 'cidade'))).to.equal('Escolha primeiro: Estado.')

    vm.chooseOption(byField(vm, 'estado'), estado.options[1])
    vm.openList(byField(vm, 'cidade'))
    vnode = render(vm)
    expect(optionTexts(vnode)).to.deep.equal(['Campo Grande', 'Dourados'])
    expect(vm.optionsNotice(byField(vm, 'cidade'))).to.equal('')

    type(vm, 'cidade', 'dou')
    vnode = render(vm)
    expect(optionTexts(vnode)).to.deep.equal(['Dourados'])
    expect(vm.comboboxText(byField(vm, 'cidade'))).to.equal('dou')

    const enter = key(vm, 'cidade', 'Enter')
    expect(enter.defaultPrevented).to.equal(true)
    expect(vm.formValues.cidade).to.equal('5003702')

    vm.submit()
    expect(sent).to.have.length(1)
    expect(sent[0].content).to.deep.equal({ estado: 'MS', cidade: '5003702' })
    expect(sent[0].summary).to.equal('Estado: Mato Grosso do Sul\nCidade: Dourados')
  })

  it('searches ignoring case and accents, with the options that start with the text first', () => {
    const { vm } = createForm([estado])
    const field = byField(vm, 'estado')

    type(vm, 'estado', 'SAO')
    expect(vm.matchingOptions(field).map((option) => option.value)).to.deep.equal(['SP'])

    type(vm, 'estado', 'grosso')
    expect(vm.matchingOptions(field).map((option) => option.value)).to.deep.equal(['MT', 'MS'])

    type(vm, 'estado', 'xyz')
    expect(vm.listState.matches).to.have.length(0)
    expect(vm.comboboxStatus(field)).to.equal('Nenhuma opção encontrada.')
  })

  it('clears the city when the state changes, without showing an error before the user answers', () => {
    const { vm } = createForm([estado, cidade()])

    vm.chooseOption(byField(vm, 'estado'), estado.options[2])
    vm.chooseOption(byField(vm, 'cidade'), { value: '3509502', label: 'Campinas' })

    return Vue.nextTick().then(() => {
      expect(vm.formValues.cidade).to.equal('3509502')
      vm.chooseOption(byField(vm, 'estado'), estado.options[0])
      return Vue.nextTick()
    }).then(() => {
      expect(vm.formValues.cidade).to.equal('')
      expect(vm.touched.cidade).to.equal(false)
      expect(vm.showError(byField(vm, 'cidade'))).to.equal(false)
      expect(vm.comboboxText(byField(vm, 'cidade'))).to.equal('')
    })
  })

  it('does not accept typed text that is not an option, but picks an exact label', () => {
    const { vm, sent } = createForm([estado])
    const field = byField(vm, 'estado')

    type(vm, 'estado', 'Bahia')
    vm.onComboboxBlur(field)
    expect(vm.fieldErrors.estado.key).to.equal('option')
    expect(vm.fieldErrors.estado.message).to.equal('Escolha uma opção da lista.')
    expect(vm.showError(field)).to.equal(true)
    vm.submit()
    expect(sent).to.have.length(0)

    type(vm, 'estado', 'sao paulo')
    expect(vm.formValues.estado).to.equal('SP')
    vm.onComboboxBlur(field)
    expect(vm.comboboxText(field)).to.equal('São Paulo')
    expect(vm.fieldErrors.estado).to.equal(null)
  })

  it('moves through the options with the arrow keys and closes the list with Escape', () => {
    const { vm } = createForm([estado])
    const field = byField(vm, 'estado')

    key(vm, 'estado', 'ArrowDown')
    expect(vm.isListOpen(field)).to.equal(true)
    key(vm, 'estado', 'ArrowDown')
    key(vm, 'estado', 'ArrowDown')
    expect(vm.activeOptionId(field)).to.equal(vm.comboboxOptionId('estado', 1))
    key(vm, 'estado', 'ArrowUp')
    key(vm, 'estado', 'ArrowUp')
    expect(vm.listState.activeIndex).to.equal(2)

    const vnode = render(vm)
    const input = comboboxInput(vnode)
    expect(attrs(input)['aria-expanded']).to.equal('true')
    expect(attrs(input)['aria-activedescendant']).to.equal(vm.comboboxOptionId('estado', 2))

    expect(key(vm, 'estado', 'Escape').defaultPrevented).to.equal(true)
    expect(vm.isListOpen(field)).to.equal(false)
    // With the list closed, Enter is left to the form (send / continue)
    expect(key(vm, 'estado', 'Enter').defaultPrevented).to.equal(false)
  })

  it('renders at most 50 options and asks the user to type to see the others', () => {
    const many = Array.apply(null, { length: 120 }).map((item, index) => ({ value: `c${index}`, label: `Cidade ${index}` }))
    const { vm } = createForm([{ id: 'municipio', label: 'Município', type: 'select', searchable: true, options: many }])
    const field = byField(vm, 'municipio')

    vm.openList(field)
    expect(optionTexts(render(vm))).to.have.length(50)
    expect(vm.comboboxStatus(field)).to.equal('Mostrando 50 de 120. Digite para filtrar.')

    type(vm, 'municipio', 'cidade 11')
    expect(optionTexts(render(vm))).to.deep.equal(['Cidade 11', 'Cidade 110', 'Cidade 111', 'Cidade 112', 'Cidade 113',
      'Cidade 114', 'Cidade 115', 'Cidade 116', 'Cidade 117', 'Cidade 118', 'Cidade 119'])
  })

  it('keeps a pre-filled city that belongs to the pre-filled state', () => {
    const { vm, sent } = createForm([
      Object.assign({}, estado, { value: 'MT' }),
      cidade({ value: '5108402' })
    ])

    return Vue.nextTick().then(() => {
      expect(vm.comboboxText(byField(vm, 'cidade'))).to.equal('Várzea Grande')
      vm.submit()
      expect(sent[0].content).to.deep.equal({ estado: 'MT', cidade: '5108402' })
    })
  })

  it('also filters a native select and radio groups, and sends empty a field without options for the parent value', () => {
    const { vm, sent } = createForm([
      { id: 'uf', label: 'UF', type: 'select', options: [{ value: 'PB', label: 'PB' }, { value: 'TO', label: 'TO' }] },
      { id: 'cidade', label: 'Cidade', type: 'select', required: true, dependsOn: 'uf', options: { PB: [{ value: 'jp', label: 'João Pessoa' }] } },
      { id: 'agencia', label: 'Agência', type: 'radio', required: true, dependsOn: 'uf', options: { PB: [{ value: 'a1', label: 'Centro' }] } }
    ])

    vm.formValues.uf = 'PB'
    let vnode = render(vm)
    expect(findAll(vnode, (node) => node.tag === 'option').map((node) => textOf(node).trim()))
      .to.deep.equal(['UF', 'PB', 'TO', 'Cidade', 'João Pessoa'])
    expect(findAll(vnode, (node) => node.tag === 'input' && attrs(node).type === 'radio')).to.have.length(1)

    vm.formValues.uf = 'TO'
    vnode = render(vm)
    const citySelect = findAll(vnode, (node) => node.tag === 'select')[1]
    expect(attrs(citySelect).disabled).to.equal(true)
    expect(vm.optionsNotice(byField(vm, 'cidade'))).to.equal('Nenhuma opção disponível.')

    vm.submit()
    expect(sent).to.have.length(1)
    expect(sent[0].content).to.deep.equal({ uf: 'TO', cidade: '', agencia: '' })
  })

  it('chooses the exact label typed even when it is the start of another option listed before it', () => {
    const options = [
      { value: '3517307', label: 'Guaraçaí' },
      { value: '3517406', label: 'Guará' },
      { value: '3517000', label: 'Nova Guará' }
    ]
    const { vm } = createForm([{ id: 'cidade', label: 'Cidade', type: 'select', searchable: true, options }])

    type(vm, 'cidade', 'guara')
    expect(vm.formValues.cidade).to.equal('3517406')
    expect(vm.listState.visible.map((option) => option.label)).to.deep.equal(['Guará', 'Guaraçaí', 'Nova Guará'])
    expect(key(vm, 'cidade', 'Enter').defaultPrevented).to.equal(true)
    expect(vm.formValues.cidade).to.equal('3517406')
  })

  it('clears a chain of dependent fields (state, city, districts) and focuses the parent still missing', () => {
    const focused = []
    global.document = { getElementById: (id) => ({ focus: () => focused.push(id) }) }
    const { vm, sent } = createForm([
      estado,
      cidade(),
      {
        id: 'bairros',
        label: 'Bairros',
        type: 'checkbox',
        required: true,
        dependsOn: 'cidade',
        options: { 3509502: [{ value: 'cambui', label: 'Cambuí' }, { value: 'taquaral', label: 'Taquaral' }] }
      }
    ])

    vm.submit()
    expect(sent).to.have.length(0)
    return Vue.nextTick().then(() => {
      expect(focused[focused.length - 1]).to.equal(vm.fieldInputId('estado'))

      vm.chooseOption(byField(vm, 'estado'), estado.options[2])
      vm.chooseOption(byField(vm, 'cidade'), { value: '3509502', label: 'Campinas' })
      vm.formValues.bairros = ['taquaral']
      return Vue.nextTick()
    }).then(() => {
      expect(vm.effectiveValue(byField(vm, 'bairros'))).to.deep.equal(['taquaral'])
      vm.chooseOption(byField(vm, 'estado'), estado.options[0])
      return Vue.nextTick()
    }).then(() => {
      expect(vm.formValues.cidade).to.equal('')
      expect(vm.formValues.bairros).to.deep.equal([])
      expect(vm.optionsNotice(byField(vm, 'bairros'))).to.equal('Escolha primeiro: Cidade.')
    }).then(() => {
      global.document = { getElementById: () => null }
    }, (error) => {
      global.document = { getElementById: () => null }
      throw error
    })
  })

  it('focuses the optional parent that a required dependent field waits for', () => {
    const focused = []
    global.document = { getElementById: (id) => ({ focus: () => focused.push(id) }) }
    const { vm, sent } = createForm([
      Object.assign({}, estado, { required: false }),
      cidade()
    ])

    vm.submit()
    expect(sent).to.have.length(0)
    expect(vm.fieldErrors.estado).to.equal(null)
    return Vue.nextTick().then(() => {
      expect(focused).to.deep.equal([vm.fieldInputId('estado')])
    }).then(() => {
      global.document = { getElementById: () => null }
    }, (error) => {
      global.document = { getElementById: () => null }
      throw error
    })
  })

  it('hides a dependent field together with a parent hidden by showWhen, and ignores a showWhen in a cycle through dependsOn', () => {
    const { vm, sent } = createForm([
      { id: 'local', label: 'Local', type: 'radio', required: true, options: [{ value: 'casa', label: 'Minha casa' }, { value: 'outro', label: 'Outro local' }] },
      Object.assign({}, estado, { showWhen: { field: 'local', equals: 'outro' } }),
      cidade()
    ])

    vm.formValues.local = 'casa'
    expect(vm.visibleFields.map((field) => field.id)).to.deep.equal(['local'])
    vm.submit()
    expect(sent).to.have.length(1)
    expect(sent[0].content).to.deep.equal({ local: 'casa', estado: '', cidade: '' })

    const loop = createForm([
      Object.assign({}, estado, { showWhen: { field: 'cidade', equals: '5103403' } }),
      cidade({ required: false })
    ])
    expect(loop.vm.visibleFields.map((field) => field.id)).to.deep.equal(['estado', 'cidade'])
  })

  it('ignores grouped options without a valid field before them, and keeps plain selects as they were', () => {
    const { vm } = createForm([
      cidade({ dependsOn: 'estado' }),
      estado,
      { id: 'bairro', label: 'Bairro', type: 'select', options: { x: [{ value: 'b', label: 'B' }] } },
      { id: 'motivo', label: 'Motivo', type: 'select', options: [{ value: 'm', label: 'M' }] }
    ])

    expect(vm.formFields.map((field) => field.id)).to.deep.equal(['estado', 'motivo'])
    const vnode = render(vm)
    expect(findAll(vnode, (node) => node.tag === 'select')).to.have.length(1)
    expect(comboboxInput(vnode)).to.not.equal(undefined)
  })
})
