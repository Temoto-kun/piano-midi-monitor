import messages from './messages.json'

type MsgId = keyof typeof messages

interface GetMessage {
  (msgId: string): string,
}

export const _: GetMessage = (msgId) => {
  const { [msgId as MsgId]: msgStr = msgId } = messages
  return msgStr
}
