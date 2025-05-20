import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='mt-5'>
        <img src="/static/footer-divider.svg" alt="" style={{width:'100%'}}/>
        <div className="footer py-4">
            <div className="d-flex flex-column container-xxl">
                <div className="d-flex justify-content-between mb-5 pt-2">
                    <div className="d-flex flex-column text-center">
                        <p className='footer-title'>Інформація</p>
                        <p className='footer-link'>Про нас</p>
                        <p className='footer-link'>Благодійність</p>
                        <p className='footer-link'>Блог</p>
                    </div>
                    <div className="d-flex flex-column text-center">
                        <p className='footer-title'>Покупцю</p>
                        <p className='footer-link'>Доставка та оплата</p>
                        <p className='footer-link'>Наші магазини</p>
                        <p className='footer-link'>Повернення</p>
                    </div>
                    <div className="d-flex flex-column text-center">
                        <p className='footer-title'>Графік роботи</p>
                        <p className='footer-link'>Пн-Пт: 10:00-19:00</p>
                        <p className='footer-link'>Сб: 10:00-18:00</p>
                        <p className='footer-link'>Нд: Вихідний</p>
                    </div>
                    <div className="d-flex flex-column text-center">
                        <p className='footer-title'>Контакти</p>
                        <p className='footer-link'>+380688935000</p>
                        <p className='footer-link'>+380688935000</p>
                        <p className='footer-link'>ExoWorldSupport@gmail.com</p>
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <img src="/static/MasterCard.svg" alt="" className='m-0'/>
                        <img src='/static/Visa.svg' alt="" className='m-0'/>
                        <img src='/static/GooglePay.svg' alt="" className='m-0'/>
                    </div>
                    <div className="">
                        <img src='/static/inst.svg' alt=""  className='me-3'/>
                        <img src='/static/facebook.svg' alt=""  className='me-3'/>
                        <img src='/static/youtube.svg' alt=""  className='me-3'/>
                        <img src='/static/tiktok.svg' alt=""  className='me-0'/>
                    </div>
                </div>
            </div>
            
        </div>
    </footer>
  )
}

export default Footer