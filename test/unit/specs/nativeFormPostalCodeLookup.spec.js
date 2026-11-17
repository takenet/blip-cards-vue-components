// `lookup` on a masked field: the postal code fills the address fields of the same form.
import Vue from 'vue'
import sinon from 'sinon'
import { renderVNode, findAll } from '../helpers/vueSfc'
import NativeForm from '../../../src/components/NativeForm.vue'

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const deferred = () => {
  const result = {}
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

const jsonResponse = (data, status = 200) => ({
  status,
  ok: status >= 200 && status < 300,
  json: () => Promise.resolve(data)
})

const VIACEP_SE = { cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', localidade: 'São Paulo', uf: 'SP' }

// Requests answered by the test, one per call, in call order
const controlledFetch = () => {
  const calls = []
  const fetch = (url, options) => {
    const call = deferred()
    call.url = url
    call.options = options
    calls.push(call)
    return call.promise
  }
  return { calls, fetch }
}

const addressFields = (lookup, cepOverrides) => [
  Object.assign({ id: 'cep', label: 'CEP', type: 'text', mask: '00000-000', required: true, lookup }, cepOverrides),
  { id: 'rua', label: 'Rua', type: 'text', required: true },
  { id: 'numero', label: 'Número', type: 'text', required: true },
  { id: 'bairro', label: 'Bairro', type: 'text', required: true },
  { id: 'cidade', label: 'Cidade', type: 'text', required: true },
  { id: 'uf', label: 'UF', type: 'select', required: true, options: [{ value: 'SP', label: 'SP' }, { value: 'MT', label: 'MT' }] }
]

const VIACEP = { provider: 'viacep', fill: { rua: 'logradouro', bairro: 'bairro', cidade: 'localidade', uf: 'uf' } }

const createForm = (fields, props) => {
  const sent = []
  const { vm } = renderVNode(NativeForm, Object.assign({
    document: { validation: { fields } },
    onSelected: (summary, message) => sent.push({ summary, content: message.content })
  }, props))
  // Not mounted: submit only checks that the form exists
  vm.$refs.form = {}
  return { vm, sent }
}

const field = (vm, id) => vm.formFields.find((current) => current.id === id)

const type = (vm, id, value) => {
  vm.onTextInput(field(vm, id), { target: { value } })
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

const textOf = (vnode) => vnode.text !== undefined
  ? vnode.text
  : (vnode.children || []).map(textOf).join('')

describe('NativeForm - postal code lookup', () => {
  let previousDocument
  let previousFetch

  before(() => {
    previousDocument = global.document
    global.document = { getElementById: () => null }
  })

  after(() => {
    global.document = previousDocument
  })

  beforeEach(() => {
    previousFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = previousFetch
  })

  it('fills and locks the address once the postal code is complete, and sends every field in one answer', async () => {
    const { calls, fetch } = controlledFetch()
    global.fetch = fetch
    const { vm, sent } = createForm(addressFields(VIACEP))

    type(vm, 'cep', '0100100')
    expect(calls).to.have.length(0)
    type(vm, 'cep', '01001000')
    expect(vm.formValues.cep).to.equal('01001-000')
    expect(calls).to.have.length(1)
    expect(calls[0].url).to.equal('https://viacep.com.br/ws/01001000/json/')
    expect(calls[0].options.credentials).to.equal('omit')
    expect(calls[0].options.referrerPolicy).to.equal('no-referrer')
    // The same value (input + change events) is not looked up twice
    type(vm, 'cep', '01001-000')
    expect(calls).to.have.length(1)

    calls[0].resolve(jsonResponse(VIACEP_SE))
    await flush()

    expect(vm.formValues).to.include({ rua: 'Praça da Sé', bairro: 'Sé', cidade: 'São Paulo', uf: 'SP' })
    expect(vm.isLookupLocked(field(vm, 'rua'))).to.equal(true)
    expect(vm.isLookupLocked(field(vm, 'uf'))).to.equal(true)
    expect(vm.isLookupLocked(field(vm, 'numero'))).to.equal(false)

    // Locked fields are rendered read-only and keep the value found
    const inputs = findAll(render(vm), (node) => node.tag === 'input' && node.data && node.data.attrs &&
      node.data.attrs.id === vm.fieldInputId('rua'))
    expect(inputs[0].data.attrs.readonly).to.equal(true)
    const target = { value: 'Outra rua' }
    vm.onTextInput(field(vm, 'rua'), { target })
    expect(vm.formValues.rua).to.equal('Praça da Sé')
    expect(target.value).to.equal('Praça da Sé')

    type(vm, 'numero', '100')
    vm.submit()

    expect(sent).to.have.length(1)
    expect(sent[0].content).to.deep.equal({
      cep: '01001-000', rua: 'Praça da Sé', numero: '100', bairro: 'Sé', cidade: 'São Paulo', uf: 'SP'
    })
  })

  it('leaves the address free with a notice under the postal code when it is not found', async () => {
    const { calls, fetch } = controlledFetch()
    global.fetch = fetch
    const { vm, sent } = createForm(addressFields(VIACEP))

    type(vm, 'cep', '99999999')
    calls[0].resolve(jsonResponse({ erro: true }))
    await flush()

    expect(vm.lookups.cep.status).to.equal('notFound')
    expect(vm.lookupStatusText(field(vm, 'cep'))).to.equal('CEP não encontrado. Preencha o endereço.')
    expect(vm.isLookupLocked(field(vm, 'rua'))).to.equal(false)
    const status = findAll(render(vm), (node) => node.data && node.data.attrs &&
      node.data.attrs.id === vm.lookupStatusId('cep'))
    expect(textOf(status[0])).to.contain('CEP não encontrado')

    type(vm, 'rua', 'Rua Nova')
    type(vm, 'numero', '10')
    type(vm, 'bairro', 'Centro')
    type(vm, 'cidade', 'Cuiabá')
    vm.formValues.uf = 'MT'
    vm.submit()

    expect(sent).to.have.length(1)
    expect(sent[0].content).to.include({ cep: '99999-999', rua: 'Rua Nova', uf: 'MT' })
  })

  it('treats a failed or slow service like an unknown postal code and blocks sending only while it is pending', async () => {
    const { calls, fetch } = controlledFetch()
    global.fetch = fetch
    const { vm, sent } = createForm(addressFields(VIACEP))

    type(vm, 'cep', '01001000')
    vm.submit()
    expect(sent).to.have.length(0)
    expect(vm.fieldErrors.cep.key).to.equal('lookupPending')
    expect(vm.showError(field(vm, 'cep'))).to.equal(true)

    calls[0].resolve(jsonResponse({}, 500))
    await flush()

    expect(vm.lookups.cep.status).to.equal('failed')
    expect(vm.fieldErrors.cep).to.equal(null)
    expect(vm.lookupStatusText(field(vm, 'cep'))).to.equal('Não foi possível buscar o endereço. Preencha o endereço.')
  })

  it('drops the address of a postal code that was edited and ignores the late answer of the previous one', async () => {
    const { calls, fetch } = controlledFetch()
    global.fetch = fetch
    const { vm } = createForm(addressFields(VIACEP))

    type(vm, 'cep', '01001000')
    calls[0].resolve(jsonResponse(VIACEP_SE))
    await flush()
    expect(vm.formValues.rua).to.equal('Praça da Sé')

    // Editing the postal code unlocks and clears what it filled
    type(vm, 'cep', '7800000')
    expect(vm.formValues.rua).to.equal('')
    expect(vm.isLookupLocked(field(vm, 'rua'))).to.equal(false)

    type(vm, 'cep', '78000000')
    type(vm, 'cep', '7800000')
    type(vm, 'cep', '78005000')
    expect(calls).to.have.length(3)

    calls[2].resolve(jsonResponse({ logradouro: 'Rua B', bairro: 'Centro Sul', localidade: 'Cuiabá', uf: 'MT' }))
    calls[1].resolve(jsonResponse({ logradouro: 'Rua A', bairro: 'Centro', localidade: 'Cuiabá', uf: 'MT' }))
    await flush()

    expect(vm.formValues).to.include({ cep: '78005-000', rua: 'Rua B', bairro: 'Centro Sul', uf: 'MT' })
  })

  it('keeps a field edited while the lookup runs and aborts the request of a postal code that was edited', async () => {
    const { calls, fetch } = controlledFetch()
    global.fetch = fetch
    const { vm } = createForm(addressFields(VIACEP))

    type(vm, 'cep', '01001000')
    type(vm, 'rua', 'Minha rua')
    calls[0].resolve(jsonResponse(VIACEP_SE))
    await flush()

    expect(vm.formValues).to.include({ rua: 'Minha rua', bairro: 'Sé' })
    expect(vm.isLookupLocked(field(vm, 'rua'))).to.equal(false)
    expect(vm.isLookupLocked(field(vm, 'bairro'))).to.equal(true)

    type(vm, 'cep', '78005370')
    expect(calls[1].options.signal.aborted).to.equal(false)
    type(vm, 'cep', '7800537')
    expect(calls[1].options.signal.aborted).to.equal(true)
  })

  it('gives up after 8 seconds and never lets the answer of a lookup started before a reset match a new one', async () => {
    const { calls, fetch } = controlledFetch()
    global.fetch = fetch
    const settle = async () => {
      for (let i = 0; i < 10; i++) {
        await Promise.resolve()
      }
    }

    const clock = sinon.useFakeTimers()
    try {
      const { vm } = createForm(addressFields(VIACEP))
      type(vm, 'cep', '01001000')
      clock.tick(7999)
      await settle()
      expect(vm.lookups.cep.status).to.equal('loading')
      clock.tick(1)
      await settle()
      expect(vm.lookups.cep.status).to.equal('failed')
      expect(calls[0].options.signal.aborted).to.equal(true)
    } finally {
      clock.restore()
    }

    const { vm } = createForm(addressFields(VIACEP, { value: '01001000' }))
    vm.init()
    expect(calls).to.have.length(3)
    calls[1].reject(new Error('aborted'))
    await flush()
    expect(vm.lookups.cep.status).to.equal('loading')
    calls[2].resolve(jsonResponse(VIACEP_SE))
    await flush()
    expect(vm.formValues.rua).to.equal('Praça da Sé')
  })

  it('does not look up a hidden postal code and unlocks the address when the postal code is hidden', async () => {
    const { calls, fetch } = controlledFetch()
    global.fetch = fetch
    const tipo = { id: 'tipo', label: 'Tipo', type: 'select', value: 'outro', options: [{ value: 'novo', label: 'Novo' }, { value: 'outro', label: 'Outro' }] }
    const withCondition = (cep) => [tipo].concat(addressFields(VIACEP, Object.assign({ showWhen: { field: 'tipo', equals: 'novo' } }, cep)))

    createForm(withCondition({ value: '01001000' }))
    expect(calls).to.have.length(0)

    const { vm } = createForm(withCondition())
    vm.formValues.tipo = 'novo'
    type(vm, 'cep', '01001000')
    calls[0].resolve(jsonResponse(VIACEP_SE))
    await flush()
    expect(vm.isLookupLocked(field(vm, 'rua'))).to.equal(true)

    vm.formValues.tipo = 'outro'
    expect(vm.isLookupLocked(field(vm, 'rua'))).to.equal(false)
  })

  it('ignores lookups that are not https, fields without mask and read-only cards; pre-filled values are looked up', async () => {
    const { calls, fetch } = controlledFetch()
    global.fetch = fetch

    const insecure = createForm(addressFields({ url: 'http://viacep.com.br/ws/{value}/json/', fill: VIACEP.fill })).vm
    type(insecure, 'cep', '01001000')
    const unmasked = createForm(addressFields(VIACEP, { mask: undefined })).vm
    type(unmasked, 'cep', '01001000')
    createForm(addressFields(VIACEP, { value: '01001000' }), { hideOptions: true })
    // The flow already sent the address: it is not overwritten
    const withAddress = addressFields(VIACEP, { value: '01001000' })
    withAddress[1].value = 'Rua do cadastro'
    createForm(withAddress)
    expect(calls).to.have.length(0)

    const { vm } = createForm(addressFields({
      url: 'https://api.example.com/cep/{value}',
      fill: { rua: 'endereco.rua', cidade: 'endereco.cidade' }
    }, { value: '78005000' }))
    expect(calls).to.have.length(1)
    expect(calls[0].url).to.equal('https://api.example.com/cep/78005000')

    calls[0].resolve(jsonResponse({ endereco: { rua: 'Rua B\nBloco 2', cidade: 'Cuiabá' } }))
    await flush()
    expect(vm.formValues).to.include({ rua: 'Rua B Bloco 2', cidade: 'Cuiabá', bairro: '' })
    expect(vm.isLookupLocked(field(vm, 'bairro'))).to.equal(false)
  })
})
