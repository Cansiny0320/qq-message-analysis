const fs = require('fs')
const readline = require('readline')

const config = {
  startDay: '',
  keyword: '',
}

function read(file, callback) {
  const fRead = fs.createReadStream(file)
  const objReadline = readline.createInterface({
    input: fRead,
  })
  const message = {}
  let isMessageLine = false
  let key = ''
  const dateReg = /^\d{4}(-)(1[0-2]|0?\d)\1([0-2]\d|\d|30|31)$/
  objReadline.on('line', function (line) {
    if (isMessageLine) {
      message[key][message[key].length - 1].content = line
      isMessageLine = false
    }
    if (dateReg.test(line.split(' ')[0]) && line.split(' ').length === 3) {
      const [date, time, nickname] = line.split(' ')
      if (!message[date]) {
        message[date] = [
          {
            time,
            nickname,
          },
        ]
      } else {
        message[date].push({
          time,
          nickname,
        })
      }
      key = date
      isMessageLine = true
    }
  })
  objReadline.on('close', function () {
    callback(analyze(message))
  })
}

function analyze(message, config) {
  const { startDay, keyword } = config
  const keys = Object.keys(message)
  let maxDay
  let totalMessage = 0
  let totalDays = 0
  let firstMessage = ''
  let firstKeyword = ''
  let count = 0
  let interval = ''
  function mostDay(key) {
    totalMessage += message[key].length
    totalDays++
    if (!maxDay || !firstMessage) {
      const { content, time, nickname } = message[key][0]
      firstMessage = `${key} ${time} ${nickname}: ${content} `
      maxDay = key
      interval = Math.floor((+new Date() - +new Date(key)) / (24 * 3600 * 1000))
      return
    }
    if (message[maxDay].length < message[key].length) {
      maxDay = key
    }
  }
  function search(key, keywordReg) {
    const contentArr = message[key]
    contentArr.forEach(item => {
      const { content, time, nickname } = item
      const keywords = content.match(keywordReg)
      if (keywords != null && count == 0) {
        firstKeyword = `${key} ${time} ${nickname} : ${content}`
        count += keywords.length
      } else if (keywords != null) {
        count += keywords.length
      }
    })
  }
  for (const key of keys) {
    if (+new Date(key) < +new Date(startDay) && startDay) {
      continue
    }
    mostDay(key)
    search(key, new RegExp(keyword, 'gi'))
  }

  return `
<h1>结果</h1>
<p>你们第一次聊天是${firstMessage}，到现在已经${interval}天了</p>
<p>你们一共聊了：${totalDays}天，总共${totalMessage}条消息，平均每天发${Math.round(
    totalMessage / totalDays,
  )}条消息</p>
<p>你们聊天最多的一天是${maxDay}，一共发了${message[maxDay].length}条消息</p>
<p>第一次说${keyword}是${firstKeyword},目前为止你们已经说过${keyword}${count}次</p>
  `
}

module.exports = read
