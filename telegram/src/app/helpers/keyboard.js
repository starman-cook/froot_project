"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainKb = void 0;
const kb_1 = require("./kb");
exports.mainKb = {
    homeUser: [
        [kb_1.kb.home.myPage],
        [kb_1.kb.home.seeEvents],
        [kb_1.kb.home.close],
    ],
    homeDirector: [
        [kb_1.kb.home.getPayments],
        [kb_1.kb.home.myPage],
        [kb_1.kb.home.seeEvents],
        [kb_1.kb.home.close],
    ],
    homeAccountant: [
        [kb_1.kb.home.getToBePaid],
        [kb_1.kb.home.seeEvents],
        [kb_1.kb.home.myPage],
        [kb_1.kb.home.close]
    ],
    homeMaster: [
        [kb_1.kb.home.getPayments],
        [kb_1.kb.home.getToBePaid],
        [kb_1.kb.home.seeEvents],
        [kb_1.kb.home.myPage],
        [kb_1.kb.home.close]
    ]
};
