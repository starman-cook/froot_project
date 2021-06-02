# language:ru 

Функция: Создание платежа
    Сценарий: Успешное создание платежа
        Допустим я нахожусь на странице "/login"
        Если я ввожу "admin@admin.com" в поле "workEmail"
        И я ввожу "12345a" в поле "password"
        И я нажимаю на кнопку "#login"
        То я вижу текст "Menu"
        Допустим я нахожусь на странице "/new-payment"
        Если я ввожу "22-10-2021" в поле "dateOfPayment"
        И я ввожу "some purpose for payment" в поле "purpose"
        И я ввожу "some invoice for payment" в поле "invoice"
        И я ввожу "some contractor for payment" в поле "contractor"
        И я ввожу "some daysOfTermPayment for payment" в поле "daysOfTermPayment"
        И я ввожу "some costCenter for payment" в поле "costCenter"
        И я ввожу "some sum for payment" в поле "sum"
        И я нажимаю на кнопку "Добавить платеж"
        То я вижу текст "some purpose for payment"