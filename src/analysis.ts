import jieba from 'nodejieba'
import { getTimeDiff } from './utils'
import { date, Message, MessageMap } from './types'
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
  length: number
}

interface LatestMessage {
  date: date
  time: string
  content: string
  diff: number
}

export function summaryOfYear(messageMap: MessageMap) {
  const totalMessage: MessageCount = {
    total: 0,
    img: 0,
    emoji: 0,
  }

  const mostMessage: MostMessage = {
    date: '',
    num: 0,
  }

  const longestMessage: longestMessage = {
    date: '',
    time: '',
    content: '',
    length: 0,
  }

  const latestMessage: LatestMessage = {
    date: '',
    time: '',
    content: '',
    diff: Infinity,
  }

  let content = ''

  let theMostFrequentWords: string[] = []

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
    const ignoreReg = /\[表情\]|\[图片\]|哈哈哈|QQ/g
    theMostFrequentWords = jieba
      .extract(content.replace(ignoreReg, ''), top)
      .map(e => e.word)
  }

  const getTheLongestMessage = (message: Message) => {
    if (message.content.length > longestMessage.content.length) {
      longestMessage.content = message.content
      longestMessage.date = message.date
      longestMessage.time = message.time
      longestMessage.length = message.content.length
    }
  }

  const getTheLatestMessage = (message: Message) => {
    const diff = getTimeDiff(`2021-12-31 ${message.time}`, '2021-12-31 6:00:00')
    if (diff < 0 && Math.abs(diff) < latestMessage.diff) {
      latestMessage.date = message.date
      latestMessage.time = message.time
      latestMessage.content = message.content
      latestMessage.diff = Math.abs(diff)
    }
  }
  messageMap.forEach((messages, date) => {
    getTheMostMessage(messages, date)
    messages.forEach(message => {
      messageCount(message)
      getTheLongestMessage(message)
      getTheLatestMessage(message)
      content += message.content
    })
  })
  getTheMostFrequentWords(content, 5)

  return {
    totalMessage,
    longestMessage,
    theMostFrequentWords,
    mostMessage,
    latestMessage,
  }
}
