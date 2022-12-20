export enum Kind {
  Metadata = 0,
  TextNote = 1,
  RecommendServer = 2,
  ContactList = 3,
  DirectMessage = 4,
  Deletion = 5,
}

export type Filter = {
  ids?: string[]
  kinds?: Kind[]
  authors?: string[]
  since?: number
  until?: number
}

export type NostrEvent = {
  id?: string
  sig?: string
  kind: number
  tags: string[][]
  pubkey: string
  content: string
  created_at: number
}

export enum SendMsgType {
  EVENT = "EVENT",
  REQ = "REQ",
  CLOSE = "CLOSE",
}

export enum ReceiveMsgType {
  EVENT = "EVENT",
  NOTICE = "NOTICE",
  EOSE = "EOSE",
  CLOSE = "CLOSE",
}

export type SendEvent =
  | [SendMsgType.REQ, Filter]
  | [SendMsgType.EVENT, NostrEvent]

export type ReceiveEvent =
  | [ReceiveMsgType.EOSE, string]
  | [ReceiveMsgType.EVENT, string, NostrEvent]
