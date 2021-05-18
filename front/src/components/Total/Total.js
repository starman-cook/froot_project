import React from 'react'
import './Total.css'

const Total = ({payments}) => {
    
    let totalAsia = 0
      payments.filter((payment) => {
          if(payment.payer === "Froot_Middle_Asia"){
              totalAsia += Number(payment.sum)
          }
          return totalAsia
      });
      let totalBusiness = 0
      payments.filter((payment) => {
          if(payment.payer === "Froot_Бизнес"){
              totalBusiness += Number(payment.sum)
          }
          return totalBusiness
      });
    return (
        <div className="Total">
                  <h3 className="Total__title">Cумма платежей по компаниям:</h3>
                  <span className="Total__company">"Froot_Middle_Asia": <strong>{totalAsia}</strong> KZT</span>
                  <span className="Total__company">"Froot_Бизнес": <strong>{totalBusiness}</strong> KZT</span>
             </div>
    )
}

export default Total
