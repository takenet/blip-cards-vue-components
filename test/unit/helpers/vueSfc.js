// Lets mocha (plain node, no DOM, no webpack) load .vue files and render them to virtual nodes.
// Only <template> and <script> are compiled; <style> blocks are ignored.
import fs from 'fs'
import Vue from 'vue'
import * as babel from 'babel-core'
import { parseComponent, compileToFunctions } from 'vue-template-compiler'

require.extensions['.vue'] = function (module, filename) {
  const { script, template } = parseComponent(fs.readFileSync(filename, 'utf8'))
  const { code } = babel.transform(script.content, { filename })
  module._compile(code, filename)

  const options = module.exports.default || module.exports
  if (template) {
    const { render, staticRenderFns } = compileToFunctions(template.content)
    options.render = render
    options.staticRenderFns = staticRenderFns
  }
}

// Images imported by the components resolve to their path.
;['.svg', '.gif', '.png', '.jpg'].forEach((extension) => {
  require.extensions[extension] = (module, filename) => {
    module.exports = filename
  }
})

// The library installs `sanitize` as a global mixin; components rely on it. A passthrough is enough here:
// the real one does `import * as sanitize`, which is only callable under webpack.
const BaseVue = Vue.extend({ methods: { sanitize: (input) => String(input) } })

// Renders a component (without mounting it) and returns its instance and virtual node tree.
// Child components are not resolved, so they show up as plain elements with the attributes they receive.
export function renderVNode(component, propsData) {
  const previousIgnored = Vue.config.ignoredElements
  Vue.config.ignoredElements = [/-/]
  try {
    const Component = BaseVue.extend(component)
    const vm = new Component({ propsData })
    return { vm, vnode: vm._render() }
  } finally {
    Vue.config.ignoredElements = previousIgnored
  }
}

export function walk(vnode, visit, parent) {
  if (!vnode) return
  visit(vnode, parent)
  ;(vnode.children || []).forEach((child) => walk(child, visit, vnode))
}

export function findAll(vnode, predicate) {
  const found = []
  walk(vnode, (node) => predicate(node) && found.push(node))
  return found
}

const classesOf = (vnode) => [].concat((vnode.data && vnode.data.staticClass) || [], (vnode.data && vnode.data.class) || [])
  .map((value) => JSON.stringify(value))
  .join(' ')

export const isTranslationNode = (vnode) =>
  vnode.tag === 'blip-card-translation' || classesOf(vnode).indexOf('blip-card-translation') !== -1

// Plain-data view of a tree (tags, attributes, text, comments) to compare two renders.
export function serialize(vnode, ignoredAttrs = []) {
  const attrs = Object.assign({}, vnode.data && vnode.data.attrs)
  ignoredAttrs.forEach((name) => delete attrs[name])

  return {
    tag: vnode.tag,
    text: vnode.text,
    comment: !!vnode.isComment,
    staticClass: vnode.data && vnode.data.staticClass,
    class: vnode.data && vnode.data.class,
    attrs: JSON.parse(JSON.stringify(attrs)),
    domProps: vnode.data && vnode.data.domProps,
    children: (vnode.children || []).map((child) => serialize(child, ignoredAttrs))
  }
}
