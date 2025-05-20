import React from 'react'
import './Sales.css'
import ProductCard from '../../ProductCard/ProductCard'
import { useContext } from 'react'
import { Context } from '../../../index'
import { observer } from 'mobx-react-lite'


const Sales = observer(() => {
    const {product}=useContext(Context)
    return (
    <div className='sales-home d-flex flex-column justify-content-between container-xxl mt-5'>
        <div className="d-flex flex-row justify-content-between mb-4">
            <p className='text-uppercase sales-home-title m-0 align-self-end'>Зустрічайте знижки!</p>
            <div className="d-flex flex-row sales-home-arrows">
                <img src='/static/left-arrow-round.svg' alt="" className='me-4'/>
                <img src='/static/right-arrow-round.svg' alt="" />
            </div>
        </div>
        <div className="row row-cols-1 row-cols-xxl-5 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 g-4">
            {product.products.map(product=>
            <ProductCard key={product.id} product={product}/>)}
        </div>
    </div>
    )
})

export default Sales