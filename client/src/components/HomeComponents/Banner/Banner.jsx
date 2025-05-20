import React from 'react'
import './Banner.css'

const Banner = () => {
  return (
    <div className='banner-home'>
      <div className="banner-home-image-container">
        <img src="/static/home-img.png" alt="" className="banner-home-image"/>
        <div className="banner-home-content">
          <div className="d-flex flex-column justify-content-between container-xxl">
            <div className='left-top'>
              <p className='banner-home-title my-0'>ExoWorld</p>
              <p className='banner-home-text'>магазин зоотоварів для екзотичних тварин</p>
            </div>
            <p className='banner-home-title text-end right-bottom'>“Ми відповідальні за тих,<br></br>кого приручили”</p> 
          </div>
        </div>
        <div className="banner-home-divider-container">
          <img src="/static/divider-home-slider.svg" alt="" className="banner-home-divider"/>
        </div>
      </div>
    </div>
  )
}

export default Banner
