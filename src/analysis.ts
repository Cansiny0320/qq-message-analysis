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

  const messageCount = (message: Message) => {
    const emojiReg = /\[表情\]/g
    const imgReg = /\[图片\]/g
    const content = message.content
    totalMessage.total += 1
    totalMessage.emoji += (content.match(emojiReg) || []).length
    totalMessage.img += (content.match(imgReg) || []).length
  }

  const getTheMostMessageDate = (messages: Message[], date: date) => {
    if (messages.length > mostMessage.num) {
      mostMessage.num = messages.length
      mostMessage.date = date
    }
  }

  messageMap.forEach((messages, date) => {
    getTheMostMessageDate(messages, date)
    messages.forEach(message => {
      messageCount(message)
    })
  })
}
