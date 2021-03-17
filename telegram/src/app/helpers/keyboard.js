"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainKb = void 0;
var kb_1 = require("./kb");
exports.mainKb = {
    home: [
        [kb_1.kb.home.getPayments],
        [kb_1.kb.home.myPage],
        [kb_1.kb.home.close]
    ]
};
