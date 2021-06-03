import { createApp } from 'vue'
import Message from './Message.vue'
type TypeProps = 'success' | 'error' | 'default'

const setMessage = (message:string, type:TypeProps, timeout = 2000):void => {
  const instance = createApp(Message, {
    message,
    type
  })
  const node = document.createElement('div')
  document.body.appendChild(node)
  instance.mount(node)
  setTimeout(() => {
    instance.unmount()
    document.body.removeChild(node)
  }, timeout)
}
export default setMessage
