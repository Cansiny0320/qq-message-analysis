import { getMessageMap, writeFile, resolve } from './utils'
import { summaryOfYear } from './analysis'
async function main() {
  const messageMap = await getMessageMap(resolve('../message.txt'))

  writeFile(resolve('../data.json'), summaryOfYear(messageMap, 2021))
}

main()
