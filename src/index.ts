import path from 'path'
import { getMessageMap } from './utils'
import { summaryOfYear } from './analysis'
async function main() {
  const messageMap = await getMessageMap(
    path.resolve(__dirname, '../message.txt')
  )

  console.log(summaryOfYear(messageMap))
}

main()
