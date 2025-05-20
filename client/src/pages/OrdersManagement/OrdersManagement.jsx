import React from 'react'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react';
import OrderContext from '../../context/OrderContext';
import OrderCard from '../../components/AdminPages/OrderCard/OrderCard';
import './OrdersManagement.css'
import InputMask from "react-input-mask";

const OrdersManagement = observer(() => {
  const orders = useContext(OrderContext);
  return (
    <div className='container-fluid container-xxl order-page'>
      <p className='order-list-title mt-3'>Замовлення</p>
      <div className="d-flex justify-content-between mb-4">
        <InputMask
              mask="+38 099-999-99-99"
              className="search-order-by-phone"
              placeholder="+38 0XX-XXX-XX-XX"
        />
        <div className="d-flex">
          <select name="" id="" className='order-filter-select'>
            <option value="value1" selected>Очікує підтвердження</option>
            <option value="value2">Підтвержено</option>
            <option value="value3">Відправлено</option>
            <option value="value3">Доставлено</option>
            <option value="value3">Скасовано</option>
          </select>
        </div>
      </div>
      {Array.from({ length: 5 }, (_, index) => (
        <OrderCard key={index} id={index}/>
      ))}
    </div>
  )
})

export default OrdersManagement