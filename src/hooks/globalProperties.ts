import { ComponentInternalInstance, getCurrentInstance } from 'vue'
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useCurrentInstance = () => {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance
  const globalProperties = appContext.config.globalProperties
  return {
    globalProperties
  }
}
export default useCurrentInstance
