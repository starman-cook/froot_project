"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatId = exports.debug = void 0;
function debug(obj) {
    return JSON.stringify(obj, null, 4);
}
exports.debug = debug;
function getChatId(msg) {
    return msg.chat.id;
}
exports.getChatId = getChatId;
