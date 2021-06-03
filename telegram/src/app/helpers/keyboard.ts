import {kb} from "./kb";

export const mainKb: any = {
    homeUser: [
        [kb.home.myPage],
        [kb.home.seeEvents],
        [kb.home.close],
    ],
    homeDirector: [
        [kb.home.getPayments],
        [kb.home.myPage],
        [kb.home.seeEvents],
        [kb.home.close],
    ],
    homeAccountant: [
        [kb.home.getToBePaid],
        [kb.home.seeEvents],
        [kb.home.myPage],
        [kb.home.close]
    ],
    homeMaster: [
        [kb.home.getPayments],
        [kb.home.getToBePaid],
        [kb.home.seeEvents],
        [kb.home.myPage],
        [kb.home.close]
    ]
}