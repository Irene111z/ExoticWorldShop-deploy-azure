import React from 'react'
import './ProductsManagement.css'
import ProductList from '../../components/AdminPages/ProductList/ProductList'
import { CREATE_PRODUCT_ROUTE} from '../../utils/path'
import { useNavigate } from "react-router-dom"

const ProductsManagement = () => {
  const navigate = useNavigate();
  return (
    <div className='container-fluid container-xxl'>
      <p className='mt-3 admin-products-title'>Товари</p>
      <div className="d-flex justify-content-between">
        <input type="text" placeholder='Пошук' className='search-product-admin'/>
        <button className='add-product-link' onClick={() => navigate(`${CREATE_PRODUCT_ROUTE}`)}>Додати товар</button>
      </div>
      <ProductList/>
    </div>
  )
}

export default ProductsManagement