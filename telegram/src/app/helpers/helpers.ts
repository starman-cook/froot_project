import {PaymentInterface} from "../interfaces/payment-interface";
import {mainKb} from "./keyboard";


// Эта функция просто возвращает чат id
export function getChatId(msg: any) {
    return msg.chat.id
}

// Эта функция просто собирает стандартный текст для caption од изображением, здесь все детали по заявке
export function createTextForMessage(data: PaymentInterface, head: string, subHead: string, withId: boolean) {

    return `
<strong>${head}</strong>

<i>${subHead}</i>

<b>Категория: </b>      <pre>${data.priority}</pre>
<b>Статус: </b>         <pre>${data.approved ? "Подтверждена" : data.paided ? "Оплачен" : "Еще не подтверждена"}</pre>
<b>Назначение: </b>     <pre>${data.purpose}</pre>
<b>Плательщик: </b>     <pre>${data.payer}</pre>
<b>Контрактор: </b>     <pre>${data.contractor}</pre>
<b>Дата платежа: </b>   <pre>${data.dateOfPayment}</pre>
<b>Сумма: </b>          <pre>${data.sum} тг</pre>
${withId ? `<b>id: </b>             <pre>${data._id}</pre>` : ""}
    `
}

// Эта функция определяет определяет есть ли изображение, и если нет, то ставит дефолтное
export function applyImage (imageReq: string, fs: any) {

    let image;
    if (imageReq) {
        if (fs.existsSync('./public/images/' + imageReq)) {
            image = './public/images/' + imageReq
        } else {
            image = './public/images/default.png'
        }
    } else {
        image = './public/images/default.png'
    }
    return image
}

// Эта функция определяет какую клавиатуру показать на экране
export function getKeyBoard(user: any) {
    let keyB: any
    if (!user) keyB = mainKb.home
    if (user.role.includes('viewTodayPayments') && user.role.includes('viewToBePaid')) keyB = mainKb.homeMaster
    else if (user.role.includes('viewTodayPayments')) keyB = mainKb.homeDirector
    else if (user.role.includes('viewToBePaid')) keyB = mainKb.homeAccountant
    return keyB
}