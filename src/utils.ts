import fs from 'fs/promises'
import dayjs from 'dayjs'
import { MessageMap } from './types'

export async function getMessageMap(path) {
  const messageMap: MessageMap = new Map()
  const file = await fs.readFile(path, 'utf-8')
  const data = file.split('\r\n')
  data.forEach((e, i) => {
    const infoRowReg =
      /\d{4}(-)(1[0-2]|0?\d)\1([0-2]\d|\d|30|31) \d+:[0-5]\d:[0-5]\d/
    if (!infoRowReg.test(e)) return
    const [date, time, nickname] = e.split(' ')
    const content = data[i + 1]
    if (messageMap.has(date)) {
      messageMap.get(date).push({ nickname, date, time, content })
    } else {
      messageMap.set(date, [{ nickname, date, time, content }])
    }
  })
  return messageMap
}

export function getTimeDiff(date1: string, date2: string) {
  const d1 = dayjs(date1)
  const d2 = dayjs(date2)
  return d1.diff(d2, 'second')
}
