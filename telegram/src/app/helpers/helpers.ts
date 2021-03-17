export function debug (obj: Object) {
    return JSON.stringify(obj, null, 4)
}

export function getChatId(msg: any) {
    return msg.chat.id
}
