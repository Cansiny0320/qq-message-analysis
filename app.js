const fs = require('fs')
const readline = require('readline')
// const nodejieba = require('nodejieba')

// async function read(file, encoding) {
//   const data = await fs.readFileSync(file, encoding)
//   const arr = nodejieba.cut(data)
//   console.log(arr)
// }

// read('./message.txt', 'utf-8')
function read(file, callback) {
  const fRead = fs.createReadStream(file)
  const objReadline = readline.createInterface({
    input: fRead,
  })
  const message = {}
  let isMessageLine = false
  let pushKey = ''
  let result = ''
  objReadline.on('line', function (line) {
    if (isMessageLine) {
      message[pushKey].push(line)
      isMessageLine = false
    }
    if (line.startsWith('2020') || line.startsWith('2021')) {
      if (!message[line.split(' ')[0]]) {
        message[line.split(' ')[0]] = []
      }
      pushKey = line.split(' ')[0]
      isMessageLine = true
    }
  })
  objReadline.on('close', function () {
    callback(analyze(message))
  })
}
function analyze(message) {
  const keys = Object.keys(message)
  let maxDay = keys[0]
  let total = 0
  for (const key of keys) {
    total += message[key].length
    if (message[maxDay].length < message[key].length) {
      maxDay = key
    }
  }
  return `
<p>你们已经聊了：${keys.length}天，总共${total}条消息</p>
<p>你们聊天最多的一天是${maxDay}，一共发了${message[maxDay].length}条消息</p>
  `
}

module.exports = read
