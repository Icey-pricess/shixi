import { ColumnProps, ImageProps, UserProps } from '../store'
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
    }
  }
}
interface CheckCondition{
  format?: string[];
  size?:number
}
interface beforeUploadCheckReturn {
  passed: boolean,
  error:string|null
}
type ErrorProps = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: CheckCondition):beforeUploadCheckReturn {
  const { format, size } = condition
  const isValidateFormat = format ? format.includes(file.type) : true
  const isValidateSize = size ? file.size / 1024 / 1024 < size : true
  let error: ErrorProps = null
  if (!isValidateFormat) {
    error = 'format'
  }
  if (!isValidateSize) {
    error = 'size'
  }
  return {
    passed: isValidateSize && isValidateFormat,
    error
  }
}
interface TestProps{
  _id: string,
  name: string
}
const testData1: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]
const testData2: { [key: string]: TestProps } = { 1: { _id: '1', name: 'a' }, 2: { _id: '2', name: 'b' } }

export const arrayToObject = <T extends { _id?: string }>(arr: Array<T>): { [key:string]:T} => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as {[key:string]:T})
}
console.log('test---', arrayToObject(testData1))

export const objectToArray = <T>(obj: {[key:string]:T}): T[] => {
  return Object.keys(obj).map(key => obj[key])
}

console.log('test2---', objectToArray(testData2))
