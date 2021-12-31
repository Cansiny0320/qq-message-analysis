import { date, Message, MessageMap } from './types'
import jieba from 'nodejieba'
interface MessageCount {
  total: number
  img: number
  emoji: number
}

interface MostMessage {
  date: date
  num: number
}

interface longestMessage {
  date: date
  time: string
  content: string
}

export function summaryOfYear(messageMap: MessageMap) {
  const totalMessage: MessageCount = {
    total: 0,
    img: 0,
    emoji: 0,
  }

  let mostMessage: MostMessage = {
    date: '',
    num: 0,
  }

  let longestMessage: longestMessage = {
    date: '',
    time: '',
    content: '',
  }

  let content = ''

  const messageCount = (message: Message) => {
    const emojiReg = /\[表情\]/g
    const imgReg = /\[图片\]/g
    const content = message.content
    totalMessage.total += 1
    totalMessage.emoji += (content.match(emojiReg) || []).length
    totalMessage.img += (content.match(imgReg) || []).length
  }

  const getTheMostMessage = (messages: Message[], date: date) => {
    if (messages.length > mostMessage.num) {
      mostMessage.num = messages.length
      mostMessage.date = date
    }
  }

  const getTheMostFrequentWords = (content: string, top: number) => {
    return jieba.extract(content, top).map(e => e.word)
  }

  const getTheLongestMessage = (message: Message) => {
    if (message.content.length > longestMessage.content.length) {
      longestMessage.content = message.content
      longestMessage.date = message.date
      longestMessage.time = message.time
    }
  }
  messageMap.forEach((messages, date) => {
    getTheMostMessage(messages, date)
    messages.forEach(message => {
      messageCount(message)
      getTheLongestMessage(message)
      content += message.content
    })
  })
  getTheMostFrequentWords(content, 5)
}
