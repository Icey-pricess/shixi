import { DirectiveBinding, ObjectDirective } from 'vue'
type DocumentHandler = <T extends MouseEvent>(e:T) => void

interface ListProps {
  documentHandler?: DocumentHandler
  // bindingFn?: (...args: unknown[]) => unknown
}

let nodeList: ListProps = {}

function createDocumentHandler(
  el: HTMLElement,
  binding: DirectiveBinding
): DocumentHandler {
  return function (e: MouseEvent) {
    const target = e.target as HTMLElement
    if (el.contains(target)) {
      return false
    }
    if (binding.arg) {
      binding.value(e)
    }
  }
}

const handler = (e: MouseEvent) => {
  const { documentHandler } = nodeList
  if (documentHandler) {
    documentHandler(e)
  }
}

window.addEventListener('click', handler)

const ClickOutSide: ObjectDirective = {
  beforeMount(el, binding) {
    nodeList = {
      documentHandler: createDocumentHandler(el, binding)
      // bindingFn: binding.value
    }
  },
  updated(el, binding) {
    nodeList = {
      documentHandler: createDocumentHandler(el, binding)
      // bindingFn: binding.value
    }
  },
  unmounted() {
    window.removeEventListener('click', handler)
  }
}
export default ClickOutSide
