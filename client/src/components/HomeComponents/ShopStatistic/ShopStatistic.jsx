import React from 'react'
import './ShopStatistic.css'

const ShopStatistic = () => {
  return (
    <div className='d-flex justify-content-between container-fluid container-xxl mb-5'>
        <div className="flag me-5" style={{backgroundColor:'#FFB335', color:'#ffffff'}}>
            <p className='flag-title mb-2'>1738</p>
            <p className='flag-text'>задоволених<br/>клієнтів</p>
        </div>
        <div className="flag me-5" style={{backgroundColor:'#ffffff', color:'#546C42'}}>
            <p className='flag-title mb-2'>7</p>
            <p className='flag-text'>магазинів по всій Україні</p>
        </div>
        <div className="flag me-5" style={{backgroundColor:'#5D7947', color:'#ffffff'}}>
            <p className='flag-title mb-2'>846</p>
            <p className='flag-text'>унікальних<br/>товарів</p>
        </div>
        <div className="flag" style={{backgroundColor:'#C1FA63', color:'#546C42'}}>
            <p className='flag-title mb-2'>5</p>
            <p className='flag-text'>років<br/>досвіду</p>
        </div>
    </div>
  )
}

export default ShopStatistic