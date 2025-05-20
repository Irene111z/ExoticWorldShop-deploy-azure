import { useEffect, useState } from 'react';
import { fetchCart } from '../../http/productAPI';
import './OrderPage.css';

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart()
      .then(data => setCartItems(data.cart_items || []))
      .catch(() => alert('Не вдалося завантажити кошик'));
  }, []);

  return (
    <div className="order-page container-fluid container-xxl mt-5">
      <div className="d-flex row py-5">
        <form className="order-form d-flex flex-column col-4 offset-1">
          <h5 className='mb-3'>Оформлення замовлення</h5>
          <h6>Дані для відправки:</h6>
          <input type="text" placeholder="Ім’я" required className='mb-2'/>
          <input type="text" placeholder="Прізвище" required className='mb-2'/>
          <input type="email" placeholder='Email' required className='mb-2'/>
          <input type="tel" placeholder="Телефон" required className='mb-4'/>
          <h6>Спосіб доставки:</h6>
          <select name="" id="" className='mb-2 text-start'>
            <option value="">Нова Пошта</option>
            <option value="">Укрпошта</option>
            <option value="">Самовивіз</option>
          </select>
          <input type="text" placeholder="Адреса доставки" required className='mb-4'/>
          <h6>Спосіб оплати:</h6>
          <select name="" id="" className='mb-4 text-start' defaultValue="">
            <option value="" disabled>Оберіть спосіб оплати</option>
            <option value="">Накладний платіж</option>
            <option value="">Оплата на рахунок ФОП</option>
          </select>
          <textarea name="" id=""placeholder='Коментар до замовлення'className='mb-4'></textarea>
          <button type="submit" className='confirm-order-btn'>Підтвердити замовлення</button>
        </form>
        <div className="order-cart-items col-5 offset-1">
          <h5 className='mb-3'>Товари до замовлення:</h5>
          {cartItems.length === 0 ? (
            <p>Кошик порожній</p>
          ) : (
            cartItems.map(({ id, product, quantity }) => (
              <div key={id} className="order-item d-flex">
                <img
                  src={product.images?.[0]?.img}
                  alt={product.name}
                  className="order-item-img me-4"
                />
                <div>
                  <p><strong>{product.name}</strong></p>
                  <p>Кількість: {quantity}</p>
                  <p>Ціна: {product.disc_price || product.price} грн
                    {product.disc_price ? (<span className='order-item-old-price ms-2'>{product.price} грн.</span>) : (<span/>)}</p> 
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
