export type date = string

export interface Message {
  nickname: string
  date: date
  time: string
  content: string
}

export type MessageMap = Map<date, Message[]>
