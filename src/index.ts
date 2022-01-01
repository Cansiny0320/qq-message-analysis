import { getMessageMap, writeFile, resolve } from './utils'
import { summaryOfYear } from './analysis'
import express from 'express'
async function main() {
  const messageMap = await getMessageMap(resolve('../message.txt'))

  writeFile(resolve('../public/data.json'), summaryOfYear(messageMap, 2021))
}

main()

const app = express()
app.use(express.static(resolve('../public')))
app.listen(3000)

console.log('访问 http://localhost:3000 查看报告')
